class ImportTodServiceAreaPoly < ActiveRecord::Migration[7.0]
  def up
    create_table "tod_service_area_poly", primary_key: "gid", id: :serial, force: :cascade do |t|
      t.string "srvc_name"
	  t.geometry "geom", limit: {:srid=>4326, :type=>"multi_polygon"}
      t.index ["geom"], name: "tod_service_area_poly_geom_idx", using: :gist
    end
    config   = Rails.configuration.database_configuration
    host     = config[Rails.env]["host"] ? "-h #{config[Rails.env]["host"]}" : ""
    database = config[Rails.env]["database"] ? "-d #{config[Rails.env]["database"]}" : ""
    username = config[Rails.env]["username"] ? "-U #{config[Rails.env]["username"]}" : "-U #{ENV['USER']}"
    port     = config[Rails.env]["port"] ? "-p #{config[Rails.env]["port"]}" : ""
    #pg_restore version must match the DB version
    #system("pg_restore -Fc -a -v -j 8 -t tod_service_area_poly #{host} #{username} #{database} #{port} #{Rails.root}/lib/import/tod_service_area.dump")
  end
  def down
    drop_table :tod_service_area_poly
  end
end
