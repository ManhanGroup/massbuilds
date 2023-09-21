class AddSrtaColumnsToDevelopments < ActiveRecord::Migration[7.0]
  def change
    add_column :developments, :mf2_4, :integer
    add_column :developments, :mf5up, :integer
    add_column :developments, :mobile, :integer
    add_column :developments, :studk12p, :integer
    add_column :developments, :studunip, :integer
    add_column :developments, :empedu, :integer
    add_column :developments, :empfoo, :integer
    add_column :developments, :empgov, :integer
    add_column :developments, :empind, :integer
    add_column :developments, :empmed, :integer
    add_column :developments, :empofc, :integer
    add_column :developments, :empoth, :integer
    add_column :developments, :empret, :integer
    add_column :developments, :empsvc, :integer
    add_column :developments, :year, :integer
 
  end
end
