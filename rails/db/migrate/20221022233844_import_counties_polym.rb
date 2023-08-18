class ImportCountiesPolym < ActiveRecord::Migration[7.0]
  def up
    create_table "counties_polym", primary_key: "geoid", id: :string, force: :cascade do |t|
      t.string "countyns"
	  t.string "county"
	  t.string "namelsad"
	  t.geometry "shape", limit: {:srid=>4269, :type=>"multi_polygon"}
      t.index ["shape"], name: "counties_polym_shape_idx", using: :gist
    end
    config   = Rails.configuration.database_configuration
    host     = config[Rails.env]["host"] ? "-h #{config[Rails.env]["host"]}" : ""
    database = config[Rails.env]["database"] ? "-d #{config[Rails.env]["database"]}" : ""
    username = config[Rails.env]["username"] ? "-U #{config[Rails.env]["username"]}" : "-U #{ENV['USER']}"
    port     = config[Rails.env]["port"] ? "-p #{config[Rails.env]["port"]}" : ""
    #pg_restore version must match the DB version
    #system("pg_restore -Fc -a -v -j 8 -t counties_polym #{host} #{username} #{database} #{port} #{Rails.root}/lib/import/counties_polym.dump")
  end
  def down
    drop_table :counties_polym
  end
end
