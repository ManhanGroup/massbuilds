class AddColumnTrunctToDevelopment < ActiveRecord::Migration[7.0]
  def change
    add_column :developments, :trunc, :boolean, null: false, default: false
  end
end
