class AddSchoolToDevelopments < ActiveRecord::Migration[7.0]
  def change
    add_column :developments, :school, :boolean
  end
end
