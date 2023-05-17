class AddAgencyToParcels < ActiveRecord::Migration[7.0]
  def change
    add_column :parcels, :agency, :string
  end
end
