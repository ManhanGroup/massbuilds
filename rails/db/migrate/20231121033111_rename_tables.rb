class RenameTables < ActiveRecord::Migration[7.0]
  def change
    rename_table :ca_place, :places
    rename_table :counties_polym, :counties 
    rename_table :rpa_poly, :rpas
  end
end
