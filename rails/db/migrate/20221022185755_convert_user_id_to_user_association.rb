class ConvertUserIdToUserAssociation < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :developments, :users, column: :user_id, primary_key: "id"
  end
end
