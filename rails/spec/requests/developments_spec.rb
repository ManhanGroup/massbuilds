# frozen_string_literal: true
require 'rails_helper'

RSpec.describe 'Developments:', type: :request do
  let(:valid_jsonapi_params) do
    hash = Hash.new { |h, k| h[k] = Hash.new(&h.default_proc) }
    hash['data']['type'] = 'development'
    hash['data']['attributes'] = FactoryBot.attributes_for(:development)
    hash.to_json
  end

  let(:valid_jsonapi_params_santa_cruz) do
    hash = Hash.new { |h, k| h[k] = Hash.new(&h.default_proc) }
    hash['data']['type'] = 'development'
    hash['data']['attributes'] = FactoryBot.attributes_for(
      :development,
      municipal: 'Santa Cruz',
      latitude: 36.96349692940986,
      longitude: -122.02236744119034,
      point: nil
    )
    hash.to_json
  end

  let(:valid_jsonapi_params_flag) do
    hash = Hash.new { |h, k| h[k] = Hash.new(&h.default_proc) }
    hash['data']['type'] = 'development'
    hash['data']['attributes'] = { flag: true }
    hash.to_json
  end

  describe 'listing all developments' do
    it 'works as an admin' do
      get developments_path, headers: admin_user_session
      expect(response).to have_http_status(:success)
    end

    it 'works as a municipal user' do
      get developments_path, headers: municipal_user_session
      expect(response).to have_http_status(:success)
    end

    it 'works as a verified user' do
      get developments_path, headers: verified_user_session
      expect(response).to have_http_status(:success)
    end

    it 'works as a registered user' do
      get developments_path, headers: registered_user_session
      expect(response).to have_http_status(:success)
    end

    it 'works as a guest user' do
      get developments_path, headers: guest_user_session
      expect(response).to have_http_status(:success)
    end

    it 'returns only truncated data when using trunc param' do
      FactoryBot.create(:development)
      get developments_path, params: { trunc: true }, headers: guest_user_session
      parsed_body = JSON.parse(response.body)
      expect(parsed_body['data'][0]['attributes']['name']).to eq('Seaport')
      expect(parsed_body['data'][0]['attributes']['status']).to eq('MyString')
      expect(parsed_body['data'][0]['attributes']['longitude']).to eq(-122.0223674411903)
      expect(parsed_body['data'][0]['attributes']['latitude']).to eq(36.96349692940986)
      expect(parsed_body['data'][0]['attributes']['devlper']).to eq('Workbench')
    end

    it 'returns results within the bounding box' do
      FactoryBot.create(:development, name: "Find me")
      get developments_path, params: { minLng: '-126', minLat: '0', maxLng: '0', maxLat: '45' }, headers: guest_user_session
      expect(response.body).to include("Find me")
    end

    it 'does not return results outside the bounding box' do
      FactoryBot.create(:development)
      get developments_path, params: { minLng: '-5', minLat: '0', maxLng: '0', maxLat: '5' }, headers: guest_user_session
      parsed_body = JSON.parse(response.body)
      expect(parsed_body['data'][0]).to be_nil
    end

    it 'lets you search for developments by name' do
      FactoryBot.create(:development, name: 'AMBAG')
      get developments_path, params: { term: 'AMBAG' }, headers: guest_user_session
      expect(response.body).to include('AMBAG')
    end

    it 'lets you search for developments by street address' do
      FactoryBot.create(:development)
      get developments_path, params: { term: '101 Main Street' }, headers: guest_user_session
      expect(response.body).to include('101 Main Street') # 101 Main Street is the result of the geocode query
    end

    it 'lets you search for developments by municipality name' do
      FactoryBot.create(:development)
      get developments_path, params: { term: 'Santa Cruz' }, headers: guest_user_session
      expect(response.body).to include('Santa Cruz')
    end

    it 'lets you search for developments by hotel rooms' do
      FactoryBot.create(:development)
      get developments_path, params: { hotelrms: 1 }, headers: guest_user_session
      expect(response.body).to include('Santa Cruz')
    end

    it 'lets you export developments as a CSV as a registered user' do
      FactoryBot.create(:development)
      get '/developments.csv', params: { term: 'Santa Cruz' }, headers: registered_user_session
      expect(response.content_type).to eq('text/csv')
      expect(response.body).to include('Seaport')
    end

    it 'lets you export developments as a SHP as a registered user' do
      pending 'created development disappears from test DB before pgsql2shp is invoked in this test'
      FactoryBot.create(:development)
      get '/developments.shp', params: { term: 'Santa Cruz' }, headers: registered_user_session
      expect(response.content_type).to eq('application/zip')
    end

    it 'can not export developments as a CSV as a public user' do
      pending 'potentially implement on front-end only'
      FactoryBot.create(:development)
      get '/developments.csv', params: { term: 'Santa Cruz' }, headers: guest_user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'creating developments' do
    it 'works as an admin' do
      post developments_path, params: valid_jsonapi_params, headers: admin_user_session
      expect(response).to have_http_status(:success)
    end

    it 'works as a municipal user inside their municipality' do
      post developments_path, params: valid_jsonapi_params, headers: municipal_user_session
      expect(response).to have_http_status(:success)
    end

    it 'does not work as a municipal user outside their municipality' do
      post developments_path, params: valid_jsonapi_params_santa_cruz, headers: other_municipal_user_session
      expect(response).to have_http_status(:unauthorized)
    end

    it 'works as a verified user' do
      post developments_path, params: valid_jsonapi_params, headers: verified_user_session
      aggregate_failures 'testing response' do
        expect(response).to have_http_status(:success)
        expect(response.body).not_to be_empty
      end
    end

    it 'does not work as a registered user' do
      post developments_path, params: valid_jsonapi_params, headers: registered_user_session
      expect(response).to have_http_status(:unauthorized)
    end

    it 'does not work as a public user' do
      post developments_path, params: valid_jsonapi_params, headers: guest_user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'updating developments' do
    it 'works as an admin' do
      development = FactoryBot.create(:development)
      put "/developments/#{development.id}", params: valid_jsonapi_params, headers: admin_user_session
      expect(response).to have_http_status(:success)
    end

    it 'works for verified users on developments they created' do
      user = FactoryBot.create(:user, role: 'verified')
      development = FactoryBot.create(:development, user: user)
      user_session = {
        Authorization: "Token token=#{user.authentication_token}, email=#{user.email}",
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
      put "/developments/#{development.id}", params: valid_jsonapi_params, headers: user_session
      expect(response).to have_http_status(:success)
    end

    it 'lets anyone update a flag' do
      development = FactoryBot.create(:development)
      put "/developments/#{development.id}", params: valid_jsonapi_params_flag, headers: registered_user_session
      expect(response).to have_http_status(:success)
    end

    it 'does not work for verified users on developments they did not create' do
      development = FactoryBot.create(:development)
      put "/developments/#{development.id}", params: valid_jsonapi_params, headers: verified_user_session
      expect(response).to have_http_status(:unauthorized)
    end

    it 'works for verified users on developments they created' do
      user = FactoryBot.create(:user, role: 'verified')
      development = FactoryBot.create(:development, user: user)
      user_session = {
        Authorization: "Token token=#{user.authentication_token}, email=#{user.email}",
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
      put "/developments/#{development.id}", params: valid_jsonapi_params, headers: user_session
      expect(response).to have_http_status(:success)
    end

    it 'does not work for a municipal user on developments they did not create' do
      user = FactoryBot.create(:user, role: 'municipal')
      development = FactoryBot.create(:development, user: user)
      put "/developments/#{development.id}", params: valid_jsonapi_params, headers: municipal_user_session
      expect(response).to have_http_status(:unauthorized)
    end

    it 'does not work as a registered user' do
      development = FactoryBot.create(:development)
      put "/developments/#{development.id}", params: valid_jsonapi_params, headers: registered_user_session
      expect(response).to have_http_status(:unauthorized)
    end

    it 'does not work as a public user' do
      development = FactoryBot.create(:development)
      put "/developments/#{development.id}", params: valid_jsonapi_params, headers: guest_user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'deleting developments' do
    it 'works as an admin' do
      development = FactoryBot.create(:development)
      delete "/developments/#{development.id}", headers: admin_user_session
      expect(response).to have_http_status(:no_content)
    end

    it 'works as a municipal user inside their own municipality' do
      development = FactoryBot.create(:development)
      delete "/developments/#{development.id}", headers: municipal_user_session
      expect(response).to have_http_status(:no_content)
    end

    it 'does not work as a municipal user outside their own municipality' do
      development = FactoryBot.create(:development)
      delete "/developments/#{development.id}", headers: other_municipal_user_session
      expect(response).to have_http_status(:unauthorized)
    end

    it 'does not work as a registered user' do
      development = FactoryBot.create(:development)
      delete "/developments/#{development.id}", headers: registered_user_session
      expect(response).to have_http_status(:unauthorized)
    end

    it 'does not work as a public user' do
      development = FactoryBot.create(:development)
      delete "/developments/#{development.id}", headers: guest_user_session
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'importing developments' do
    it 'fart imports a development from a csv' do
      file = Rack::Test::UploadedFile.new("#{Rails.root}/spec/fixtures/test_development_upload.csv")

      post "/developments/import", headers: admin_user_session, params: {
        filename: file
      }
      parsed_body = JSON.parse(response.body)
      expect(parsed_body['result']).not_to be_nil
      developmentResult = parsed_body['result'][0]

      expect(developmentResult['id']).not_to be_nil
      expect(developmentResult['user_id']).not_to be_nil
    end
  end

end
