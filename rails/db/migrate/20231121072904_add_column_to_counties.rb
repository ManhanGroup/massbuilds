class AddColumnToCounties < ActiveRecord::Migration[7.0]
  def change
    add_column :counties, :ispublic, :boolean, default: true
  end
end
