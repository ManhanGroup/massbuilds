require 'rails_helper'

RSpec.describe "Counties", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/counties_path"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/county/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/county/update"
      expect(response).to have_http_status(:success)
    end
  end

end
