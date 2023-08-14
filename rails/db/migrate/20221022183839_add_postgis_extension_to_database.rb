class AddPostgisExtensionToDatabase < ActiveRecord::Migration[7.0]
  def change
    # create a heroku_ext schema
    execute <<-SQL
      CREATE schema heroku_ext;
    SQL
    
    execute <<-SQL
      CREATE EXTENSION IF NOT EXISTS postgis
      SCHEMA heroku_ext;
    SQL
    #enable_extension 'postgis'
  end
end
