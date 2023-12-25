Rails.application.routes.draw do
  resources :edits, except: [:new, :edit]
  devise_for :users, controllers: { sessions: 'sessions', passwords: 'passwords' }, path_prefix: 'my'
  resources :users
  resources :rpas do
    member do
      patch :update
    end
  end
  resources :counties do
    member do
      patch :update
    end
  end
  resources :places do
    member do
      patch :update
    end
  end
  resources :developments, except: [:new, :edit]
  resources :developments do 
    collection do
      # FIXME: remove if not important
      # get 'import/new', to: :new_import
      post :import
    end
  end
  resources :password_resets, only: [:create]
  resources :parcels, only: [:index]
  resources :flags, except: [:delete, :new, :edit]
  root 'developments#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
