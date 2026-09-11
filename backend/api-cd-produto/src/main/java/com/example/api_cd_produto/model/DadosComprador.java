package com.example.api_cd_produto.model;

public class DadosComprador {
    private String tipoDocumento;
    private String documento;
    private String descricaoDocumento;
    private String endereco;
    private int numero;
    private String complemento;
    private String bairro;
    private String cep;
    private String uf;
    private String municipio;

    // Getters e Setters
    public String getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(String tipoDocumento) { this.tipoDocumento = tipoDocumento; }
    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }
    public String getDescricaoDocumento() { return descricaoDocumento; }
    public void setDescricaoDocumento(String descricaoDocumento) { this.descricaoDocumento = descricaoDocumento; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public int getNumero() { return numero; }
    public void setNumero(int numero) { this.numero = numero; }
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }
    public String getMunicipio() { return municipio; }
    public void setMunicipio(String municipio) { this.municipio = municipio; }
}
