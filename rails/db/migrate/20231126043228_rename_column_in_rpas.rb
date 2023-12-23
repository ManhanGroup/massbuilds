class RenameColumnInRpas < ActiveRecord::Migration[7.0]
  def change
    rename_column :rpas, :rpa_name, :name
  end
end
