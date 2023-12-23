class AddColumnToPlaces < ActiveRecord::Migration[7.0]
  def change
    add_column :places, :ispublic, :boolean, default: true
  end
end
