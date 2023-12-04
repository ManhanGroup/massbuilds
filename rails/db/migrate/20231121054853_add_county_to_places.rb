class AddCountyToPlaces < ActiveRecord::Migration[7.0]
  def change
    add_reference :places, :county, null: true, index: true, foreign_key: true
  end
end
