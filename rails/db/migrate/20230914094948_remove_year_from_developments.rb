class RemoveYearFromDevelopments < ActiveRecord::Migration[7.0]
  def change
    remove_column :developments, :year
  end
end
