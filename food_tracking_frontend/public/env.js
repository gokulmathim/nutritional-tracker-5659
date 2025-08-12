(function (window) {
  // PUBLIC_INTERFACE
  /**
   * Runtime environment configuration for the frontend.
   * API_BASE_URL - Base URL for the backend API used by ApiService.
   * This file is served from the app root (/) because angular.json maps the
   * "public" folder as an asset root.
   *
   * Do not place secrets in this file. It is served to clients.
   */
  window.__env = window.__env || {};
  window.__env.API_BASE_URL = window.__env.API_BASE_URL || '/api';
})(window);
