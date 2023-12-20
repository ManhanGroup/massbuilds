class ChangeColumnsInDevelopment < ActiveRecord::Migration[7.0]
  def change
    rename_column :developments, :percomp_24, :percomp_25
    rename_column :developments, :percomp_28, :percomp_30
    add_column :developments, :rhna, :boolean
    add_column :developments, :percomp_40, :integer
    add_column :developments, :ab1317, :boolean
  end
end
