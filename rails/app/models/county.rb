class County < ApplicationRecord
  self.primary_key = 'id'
  belongs_to :rpa
  has_many :places
  include PgSearch::Model
  include ActiveModel::Dirty
  pg_search_scope :search_by_county, against: [:county], using: { tsearch: { any_word: true } }
  

 
end
