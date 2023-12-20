class AddRpaToCounties < ActiveRecord::Migration[7.0]
  def change
    add_reference :counties, :rpa, null: true, index: true, foreign_key: true
  end
end
