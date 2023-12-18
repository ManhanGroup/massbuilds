class AddColumnPublicToDevelopment < ActiveRecord::Migration[7.0]
  def change
    add_column :developments, :ispublic, :boolean, null: false, default: true
  end
end
