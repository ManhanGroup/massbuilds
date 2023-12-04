class Place < ApplicationRecord
  self.primary_key = 'id'
  belongs_to :county
  belongs_to :rpa
  include PgSearch::Model
  include ActiveModel::Dirty
  pg_search_scope :search_by_namelsad, against: [:namelsad], using: { tsearch: { any_word: true } }
  

 
end
