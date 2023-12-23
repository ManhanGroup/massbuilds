class AddColumnToRpas < ActiveRecord::Migration[7.0]
  def change
    add_column :rpas, :ispublic, :boolean, default: true
  end
end
