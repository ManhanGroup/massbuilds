class AddAgencyToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :agency, :string
  end
end
