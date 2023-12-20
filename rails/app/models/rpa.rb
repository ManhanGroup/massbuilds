class Rpa < ApplicationRecord
  has_many :counties
  has_many :places
  self.primary_key = 'id'
  # include ActiveModel::Dirty
 
end
