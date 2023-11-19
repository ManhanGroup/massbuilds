class AddColumnHiddenToDevelopment < ActiveRecord::Migration[7.0]
  def change
    add_column :developments, :hidden, :boolean, null: false, default: false
  end
end
