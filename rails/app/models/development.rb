require 'zip'
require 'csv'
class Development < ApplicationRecord
  acts_as_paranoid
  has_many :edits, dependent: :destroy
  has_many :flags, dependent: :destroy
  belongs_to :user
  include PgSearch::Model
  include ActiveModel::Dirty
  pg_search_scope :search_by_name_and_location, against: [:name, :municipal, :address, :apn], using: { tsearch: { any_word: true } }
  validates :name, :status, :latitude, :longitude, :year_compl, :hu,
            :commsf, :descr, presence: true
  validates_inclusion_of :rdv, :asofright, :clusteros, :phased, :stalled, :mixed_use,
                         :headqtrs, :ovr55, :yrcomp_est, in: [true, false, nil]
  with_options if: :proposed?, presence: true do |proposed|
    proposed.validates :singfamhu
    proposed.validates :multifam
  end
  with_options if: :groundbroken?, presence: :true do |groundbroken|
    groundbroken.validates :singfamhu
    groundbroken.validates :multifam
    groundbroken.validates :affrd_unit
    groundbroken.validates :aff_u50
    groundbroken.validates :aff_50_80
    groundbroken.validates :aff_80_120
    groundbroken.validates :aff_120p
    groundbroken.validates :gqpop
    groundbroken.validates :ret_sqft
    groundbroken.validates :ofcmd_sqft
    groundbroken.validates :indmf_sqft
    groundbroken.validates :whs_sqft
    groundbroken.validates :rnd_sqft
    groundbroken.validates :ei_sqft
    groundbroken.validates :other_sqft
    groundbroken.validates :hotel_sqft
    groundbroken.validates :hotelrms
  end

  before_save :update_point
  before_save :set_traffic_count_data_present
  before_save :set_proj_id_present
  after_save :geocode
  after_save :update_rpa
  after_save :update_county
  after_save :update_municipality
  after_save :update_apn
  after_save :update_n_transit
  after_save :update_neighborhood
  after_save :update_loc_id
  after_save :update_taz

  @@excluded_attrs_from_export = [
    'other_rate',
    'affordable',
    'parcel_id',
    'programs',
    'forty_b',
    'residential',
    'commercial',
    'd_n_trnsit',
    'flag',
    'deleted_at',
    'point' # point must also be excluded here so it can be replaced with the reprojected point in the shapefile
  ]

  def self.to_csv
    attributes = self.column_names.select { |attr| !(@@excluded_attrs_from_export.include? attr) }

    CSV.generate(headers: true) do |csv|
      csv << attributes
      all.each do |development|
        csv << attributes.map do |attr|
          value = development.send(attr)
          (value.is_a? String) ? value.gsub(/\n/,"").gsub(/\;/,",").gsub(/(^\d{5}$)/,"=\"\\1\"") : value
        end
      end
    end
  end

  def self.to_bool x
    return x.to_s.downcase == "true"
  end

  def self.import file, user
    # csv import copied from rails/lib/tasks/import.rake
    csv_text = File.read(file)
    csv = CSV.parse(csv_text, headers: true, encoding: 'ISO-8859-1')
    developmentsAdded = []
    csv.each do |row|
      development = Development.new(

        rdv: self.to_bool(row["rdv"]),
        asofright: self.to_bool(row["asofright"]),
        ovr55: self.to_bool(row["ovr55"]),
        clusteros: self.to_bool(row["clusteros"]),
        phased: self.to_bool(row["phased"]),
        stalled: self.to_bool(row["stalled"]),
        name: row["name"],
        status: row["status"],
        descr: row["descr"],
        prj_url: row["prj_url"],
        address: row["address"],
        state: row["state"],
        zip_code: row["zip_code"],
        year_compl: row["year_compl"],
        prjarea: row["prjarea"],
        singfamhu: row["singfamhu"],
        hu: row["hu"],
        yrcomp_est: self.to_bool(row["yrcomp_est"]),
        gqpop: row["gqpop"],
        rptdemp: row["rptdemp"],
        commsf: row["commsf"],
        hotelrms: row["hotelrms"],
        total_cost: row["total_cost"],
        ret_sqft: row["ret_sqft"],
        ofcmd_sqft: row["ofcmd_sqft"],
        indmf_sqft: row["indmf_sqft"],
        whs_sqft: row["whs_sqft"],
        rnd_sqft: row["rnd_sqft"],
        ei_sqft: row["ei_sqft"],
        other_sqft: row["other_sqft"],
        hotel_sqft: row["hotel_sqft"],
        other_rate: row["other_rate"],
        affordable: row["affordable"],
        latitude: row["latitude"],
        longitude: row["longitude"],
        parcel_id: row["parcel_id"],
        mixed_use: self.to_bool(row["mixed_use"]),
        programs: row["programs"],
        forty_b: row["forty_b"],
        residential: row["residential"],
        commercial: row["commercial"],
        created_at: row["created_at"],
        municipal: row["municipal"],
        units_1bd: row["units_1bd"],
        units_2bd: row["units_2bd"],
        units_3bd: row["units_3bd"],
        affrd_unit: row["affrd_unit"],
        headqtrs: self.to_bool(row["headqtrs"]),
        park_type: row["park_type"],
        publicsqft: row["publicsqft"],
        devlper: row["devlper"],
        loc_id: row["loc_id"],
        parcel_fy: row["parcel_fy"],
        updated_at: row["updated_at"],
      )
      development.user = user
      development.save(validate: false)
      developmentsAdded.push(development)
    end
    return developmentsAdded
  end

  def self.to_shp
    attributes = self.column_names.select { |attr| !(@@excluded_attrs_from_export.include? attr) }
    sql = all.select(attributes.join(", ") + ", point").to_sql

    database = Rails.configuration.database_configuration[Rails.env]
    # user name, password and database name must be filled
    dbUrl = URI.parse(ENV['DATABASE_URL']) if ENV['DATABASE_URL']
    username = database['username']
    password = database['password']
    databaseName = database['database']
    host = database['host']
    port = database['port']

    if dbUrl
      username = dbUrl.user if username.blank?
      password = dbUrl.password if password.blank?
      databaseName = dbUrl.path.split('/').last if databaseName.blank?
      host = dbUrl.host if host.blank?
      port = dbUrl.port if port.blank?
    end

    hash = Digest::SHA1.hexdigest("#{Time.now.to_i}#{rand}")[0,6]
    file_name = "calbuilds-shp-#{Time.now.strftime("%Y%m%d")}-#{hash}"
    arguments = []
    arguments << "-f #{Rails.root.join('public', file_name)}"
    arguments << "-h #{host}" if host
    arguments << "-p #{port}" if port
    arguments << "-u #{username}"
    arguments << "-P #{password}"
    arguments << databaseName
    arguments << %("#{sql}") # %Q["SELECT * FROM developments;"]

    puts "calling pgsql2shp with arguments #{arguments.join(" ")}:"
    puts `pgsql2shp #{arguments.join(" ")}`

    zip(file_name)
  end

  private

  def update_point
    return if !latitude_changed? and !longitude_changed?
    self.point = "POINT (#{longitude} #{latitude})"
  end

  def geocode
    return if !saved_change_to_point?
    result = Faraday.get "https://nominatim.openstreetmap.org/reverse?format=geojson&lat=#{self.latitude}&lon=#{self.longitude}"
    
    if result && JSON.parse(result.body)['features'].length > 0
      properties = JSON.parse(result.body)['features'][0]['properties']
      logger.debug "entering geocoding"
      logger.debug properties['address']['city']
      self.update_columns(
        municipal: (properties['address']['city'].to_s || self.municipal),
        address: ((properties['address']['house_number'].to_s || '')+' '+ properties['address']['road'].to_s || self.address),
        zip_code: (properties['address']['postcode'].to_s || self.zip_code)
        )
    end
    
  end

  def self.zip(file_name)
    Zip::File.open(Rails.root.join('public', "#{file_name}.zip").to_s, Zip::File::CREATE) do |zipfile|
      #zipfile.add("#{file_name}.prj", Rails.root.join('public', 'ma_municipalities_NAD83_MassStatePlane.prj')
      zipfile.add("#{file_name}.prj", Rails.root.join('public', '4326.prj'))
      zipfile.add("#{file_name}.shp", Rails.root.join('public', "#{file_name}.shp"))
      zipfile.add("#{file_name}.shx", Rails.root.join('public', "#{file_name}.shx"))
      zipfile.add("#{file_name}.dbf", Rails.root.join('public', "#{file_name}.dbf"))
      zipfile.add("#{file_name}.cpg", Rails.root.join('public', "#{file_name}.cpg"))
    end
    return file_name
  end

  def proposed?
    status == 'proposed'
  end

  def groundbroken?
    status == ('in_construction' || 'completed')
  end

  def update_rpa
    return if !saved_change_to_point?
    rpa_query = <<~SQL
      SELECT name as rpa_name, shape
      FROM rpas
      WHERE ST_Intersects(ST_TRANSFORM(ST_GeomFromText('#{point}', 4326), 4269), shape);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(rpa_query).to_a[0]
    return if sql_result.blank?
    self.update_columns(rpa_name: sql_result['rpa_name'])
  end

  def update_county
    return if !saved_change_to_point?
    counties_query = <<~SQL
      SELECT county, shape
      FROM counties
      WHERE ST_Intersects(ST_TRANSFORM(ST_GeomFromText('#{point}', 4326), 4269), shape);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(counties_query).to_a[0]
    return if sql_result.blank?
    self.update_columns(county: sql_result['county'])
  end

  def update_municipality
    return if !saved_change_to_point?
    municipalities_query = <<~SQL
      SELECT replace(initcap(namelsad), ' Cdp', ' CDP') as namelsad, geom
      FROM places
      WHERE ST_Intersects(ST_TRANSFORM(ST_GeomFromText('#{point}', 4326), 4269), geom);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(municipalities_query).to_a[0]
    return if sql_result.blank?
    self.update_columns(municipal: sql_result['namelsad'])
  end

  def update_apn
    return if !saved_change_to_point?
    apn_query = <<~SQL
      SELECT apn, geom
      FROM parcels
      WHERE ST_Intersects(ST_GeomFromText('#{point}', 4326), geom);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(apn_query).to_a[0]
    return if sql_result.blank?
    self.update_columns(apn: sql_result['apn'])
  end

  def update_n_transit
    return if !saved_change_to_point?
    n_transit_query = <<~SQL
      SELECT srvc_name, geom
      FROM tod_service_area_poly
      WHERE ST_Intersects(ST_GeomFromText('#{point}', 4326), geom);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(n_transit_query).to_a
    return if sql_result.blank?
    transit_stops = []
    sql_result.each do |result|
      transit_stops << result['srvc_name']
    end
    self.update_columns(n_transit: transit_stops)
  end

  def update_neighborhood
    return if !saved_change_to_point?
    nhood_query = <<~SQL
      SELECT nhood_name, shape
      FROM neighborhoods_poly
      WHERE ST_Intersects(ST_GeomFromText('#{point}', 4326), shape);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(nhood_query).to_a[0]
    return if sql_result.blank?
    self.update_columns(nhood: sql_result['nhood_name'])
  end

  def update_loc_id
    return if !saved_change_to_point?
    loc_id_query = <<~SQL
      SELECT gid,apn, geom
      FROM parcels
      WHERE ST_Intersects(ST_GeomFromText('#{point}', 4326), geom);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(loc_id_query).to_a[0]
    return if sql_result.blank?
    self.update_columns(
      loc_id: sql_result['gid'],
      apn: sql_result['apn']      
    )
    #self.update_columns(loc_id: sql_result['parloc_id'])
    #self.update_columns(apn: sql_result['apn'])
  end

  def update_taz
    return if !saved_change_to_point?
    taz_query = <<~SQL
      SELECT taz_number, geometry
      FROM tazs
      WHERE ST_Intersects(ST_TRANSFORM(ST_GeomFromText('#{point}', 4326),4269), geometry);
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(taz_query).to_a[0]
    return if sql_result.blank?
    self.update_columns(taz: sql_result['taz_number'])
  end
  
  def set_proj_id_present
    self.proj_id_present = proj_id.present?
  end
  
  def set_traffic_count_data_present
    self.traffic_count_data_present = traffic_count_data.present?
  end
end
