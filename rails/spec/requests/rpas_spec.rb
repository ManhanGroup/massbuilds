require 'rails_helper'

RSpec.describe "Rpas", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/rpas_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/rpa/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/rpa/update"
      expect(response).to have_http_status(:success)
    end
  end

end
