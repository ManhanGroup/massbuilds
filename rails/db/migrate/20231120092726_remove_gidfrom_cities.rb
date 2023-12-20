class RemoveGidfromCities < ActiveRecord::Migration[7.0]
  def change
    remove_column :cities, :gid
  end
end
