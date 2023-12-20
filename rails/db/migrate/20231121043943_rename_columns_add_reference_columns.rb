class RenameColumnsAddReferenceColumns < ActiveRecord::Migration[7.0]
  def change
    rename_column :places, :gid, :id
    rename_column :counties, :geoid, :id
    rename_column :rpas, :rpa_id, :id
    add_column :places, :county_id, :string
    add_column :places, :rpa_id, :integer
    add_column :counties, :rpa_id, :integer
  end
end
