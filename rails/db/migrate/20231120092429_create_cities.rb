class CreateCities < ActiveRecord::Migration[7.0]
  def change
    create_table :cities do |t|
      t.integer :gid
      t.string :city
      t.string :county
      t.string :rpa
      t.boolean :public

      t.timestamps
    end
  end
end
