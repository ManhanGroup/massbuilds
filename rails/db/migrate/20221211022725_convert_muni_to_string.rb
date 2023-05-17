class ConvertMuniToString < ActiveRecord::Migration[7.0]
  def change
    change_column :parcels, :muni, :string
  end
end
