const API_BASE_URL = 'https://storage-backend-production.up.railway.app/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Material API methods
  async getMaterials() {
    return this.request('/material/');
  }

  async getMaterial(id) {
    return this.request(`/material/${id}/`);
  }

  async createMaterial(materialData) {
    return this.request('/material/', {
      method: 'POST',
      body: JSON.stringify(materialData),
    });
  }

  async updateMaterial(id, materialData) {
    return this.request(`/material/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(materialData),
    });
  }

  async deleteMaterial(id) {
    return this.request(`/material/${id}/`, {
      method: 'DELETE',
    });
  }

  // Product API methods
  async getProducts() {
    return this.request('/product/');
  }

  async getProduct(id) {
    return this.request(`/product/${id}/`);
  }

  async createProduct(productData) {
    return this.request('/product/', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/product/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/product/${id}/`, {
      method: 'DELETE',
    });
  }

  // Sale API methods
  async getSales() {
    return this.request('/sale/');
  }

  async getSale(id) {
    return this.request(`/sale/${id}/`);
  }

  async createSale(saleData) {
    return this.request('/sale/', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  }

  async updateSale(id, saleData) {
    return this.request(`/sale/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(saleData),
    });
  }

  async deleteSale(id) {
    return this.request(`/sale/${id}/`, {
      method: 'DELETE',
    });
  }

  // Product Assembly API methods
  async getProductAssemblies() {
    return this.request('/product_assembly/');
  }

  async getProductAssembly(id) {
    return this.request(`/product_assembly/${id}/`);
  }

  async createProductAssembly(assemblyData) {
    return this.request('/product_assembly/', {
      method: 'POST',
      body: JSON.stringify(assemblyData),
    });
  }

  async updateProductAssembly(id, assemblyData) {
    return this.request(`/product_assembly/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(assemblyData),
    });
  }

  async deleteProductAssembly(id) {
    return this.request(`/product_assembly/${id}/`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();