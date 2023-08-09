class AddColumnsToDevelopments < ActiveRecord::Migration[7.0]
  def change
    add_column :developments, :mixeduse_desc, :text
  end
end
