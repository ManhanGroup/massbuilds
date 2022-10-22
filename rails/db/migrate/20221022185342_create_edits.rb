class CreateEdits < ActiveRecord::Migration[7.0]
  def change
    create_table :edits do |t|
      t.references :user, foreign_key: true
      t.references :development, foreign_key: true
      t.json :proposed_changes

      t.timestamps
    end
	
    add_column :edits, :approved, :boolean, default: false
    add_column :edits, :deleted_at, :datetime
    add_index :edits, :deleted_at
  end
end
