require 'rails_helper'

RSpec.describe "Places", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/places_path"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/place/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/place/update"
      expect(response).to have_http_status(:success)
    end
  end

end
