class CreateDevelopments < ActiveRecord::Migration[7.0]
  def change
    create_table :developments do |t|
      t.integer :user_id
      t.boolean :rdv
      t.boolean :asofright
      t.boolean :ovr55
      t.boolean :clusteros
      t.boolean :phased
      t.boolean :stalled
      t.string :name
      t.string :status
      t.text :descr
      t.string :prj_url
      t.string :address
      t.string :state, default: 'CA'
      t.string :zip_code
      t.integer :height
      t.integer :stories
      t.integer :year_compl
      t.integer :prjarea
      t.integer :singfamhu
      t.integer :smmultifam
      t.integer :lgmultifam
      t.integer :hu
      t.integer :gqpop
      t.integer :rptdemp
      t.integer :commsf
      t.integer :hotelrms
      t.integer :onsitepark
      t.bigint :total_cost
      t.float :ret_sqft
      t.float :ofcmd_sqft
      t.float :indmf_sqft
      t.float :whs_sqft
      t.float :rnd_sqft
      t.float :ei_sqft
      t.float :other_sqft
      t.float :hotel_sqft
      t.float :other_rate
      t.float :affordable
      t.decimal :latitude
      t.decimal :longitude
      t.string :parcel_id
      t.boolean :mixed_use
      t.st_point :point, srid: 4326
      t.string :programs
      t.boolean :forty_b
      t.boolean :residential
      t.boolean :commercial
	  
      t.timestamps
    end
	
    add_column :developments, :municipal, :string
    add_column :developments, :devlper, :string
    add_column :developments, :yrcomp_est, :boolean
    add_column :developments, :units_1bd, :integer
    add_column :developments, :units_2bd, :integer
    add_column :developments, :units_3bd, :integer
    add_column :developments, :affrd_unit, :integer
    add_column :developments, :aff_u30, :integer
    add_column :developments, :aff_30_50, :integer
    add_column :developments, :aff_50_80, :integer
    add_column :developments, :aff_80p, :integer
    add_column :developments, :headqtrs, :boolean
    add_column :developments, :park_type, :string
    add_column :developments, :publicsqft, :integer
    add_column :developments, :unknownhu, :integer
    add_column :developments, :aff_unknown, :integer
    add_column :developments, :unk_sqft, :integer
    add_column :developments, :loc_id, :bigint
    add_column :developments, :parcel_fy, :integer
    add_column :developments, :rpa_name, :string
    add_column :developments, :county, :string
    add_column :developments, :nhood, :string
    add_column :developments, :n_transit, :text, array: true, default: []
    add_column :developments, :flag, :boolean, null: false, default: false
    add_column :developments, :deleted_at, :datetime
    add_index :developments, :deleted_at
    add_column :developments, :mepa_id, :integer
    add_column :developments, :traffic_count_data, :string
    add_column :developments, :mepa_id_present, :boolean
    add_column :developments, :traffic_count_data_present, :boolean
    add_column :developments, :taz, :integer
    add_column :developments, :apn, :string
    add_column :developments, :trunc, :boolean
  end
end
