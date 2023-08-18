class ImportNeighborhoodsPoly < ActiveRecord::Migration[7.0]
  def up
    create_table "neighborhoods_poly", primary_key: "gid", id: :serial, force: :cascade do |t|
      t.string "nhood_name"
	  t.geometry "shape", limit: {:srid=>4326, :type=>"multi_polygon"}
      t.index ["shape"], name: "neighborhoods_poly_shape_idx", using: :gist
    end
    config   = Rails.configuration.database_configuration
    host     = config[Rails.env]["host"] ? "-h #{config[Rails.env]["host"]}" : ""
    database = config[Rails.env]["database"] ? "-d #{config[Rails.env]["database"]}" : ""
    username = config[Rails.env]["username"] ? "-U #{config[Rails.env]["username"]}" : "-U #{ENV['USER']}"
    port     = config[Rails.env]["port"] ? "-p #{config[Rails.env]["port"]}" : ""
    #pg_restore version must match the DB version
    #system("pg_restore -Fc -a -v -j 8 -t neighborhoods_poly #{host} #{username} #{database} #{port} #{Rails.root}/lib/import/neighborhoods_poly.dump")
  end
  def down
    drop_table :neighborhoods_poly
  end
end
