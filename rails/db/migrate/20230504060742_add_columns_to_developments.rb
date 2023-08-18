class AddColumnsToDevelopments < ActiveRecord::Migration[7.0]
  def change
    add_column :developments, :sb_type, :text
  end
end
