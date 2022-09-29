# frozen_string_literal: true
class EditSerializer < ActiveModel::Serializer
  %i[id proposed_changes approved].each { |attr| attribute attr }

  belongs_to :user
  belongs_to :development

  attribute :created_at do
    object.created_at.iso8601
  end
end
