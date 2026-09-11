package com.example.api_cd_produto.model;

public class Veiculo {
    private String renavam;
    private String placa;
    private String nroEspelho;
    private String dataVenda;
    private String cnpjCartorio;
    private String cpfResponsavel;
    private String nomeArquivoP7S;
    private String conteudoArquivoP7S;
    private String caminhoArquivoP7S;
    private double tamanhoArquivoP7S;
    private DadosComprador dadosComprador;
    private DadosFirma dadosReconhecimentoFirmaVendedor;
    private DadosFirma dadosReconhecimentoFirmaComprador;

    // Construtor padrão
    public Veiculo() {}

    // Getters e Setters para todos os campos
    public String getRenavam() { return renavam; }
    public void setRenavam(String renavam) { this.renavam = renavam; }
    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }
    public String getNroEspelho() { return nroEspelho; }
    public void setNroEspelho(String nroEspelho) { this.nroEspelho = nroEspelho; }
    public String getDataVenda() { return dataVenda; }
    public void setDataVenda(String dataVenda) { this.dataVenda = dataVenda; }
    public String getCnpjCartorio() { return cnpjCartorio; }
    public void setCnpjCartorio(String cnpjCartorio) { this.cnpjCartorio = cnpjCartorio; }
    public String getCpfResponsavel() { return cpfResponsavel; }
    public void setCpfResponsavel(String cpfResponsavel) { this.cpfResponsavel = cpfResponsavel; }
    public String getNomeArquivoP7S() { return nomeArquivoP7S; }
    public void setNomeArquivoP7S(String nomeArquivoP7S) { this.nomeArquivoP7S = nomeArquivoP7S; }
    public String getConteudoArquivoP7S() { return conteudoArquivoP7S; }
    public void setConteudoArquivoP7S(String conteudoArquivoP7S) { this.conteudoArquivoP7S = conteudoArquivoP7S; }
    public String getCaminhoArquivoP7S() { return caminhoArquivoP7S; }
    public void setCaminhoArquivoP7S(String caminhoArquivoP7S) { this.caminhoArquivoP7S = caminhoArquivoP7S; }
    public double getTamanhoArquivoP7S() { return tamanhoArquivoP7S; }
    public void setTamanhoArquivoP7S(double tamanhoArquivoP7S) { this.tamanhoArquivoP7S = tamanhoArquivoP7S; }
    public DadosComprador getDadosComprador() { return dadosComprador; }
    public void setDadosComprador(DadosComprador dadosComprador) { this.dadosComprador = dadosComprador; }
    public DadosFirma getDadosReconhecimentoFirmaVendedor() { return dadosReconhecimentoFirmaVendedor; }
    public void setDadosReconhecimentoFirmaVendedor(DadosFirma dadosReconhecimentoFirmaVendedor) { this.dadosReconhecimentoFirmaVendedor = dadosReconhecimentoFirmaVendedor; }
    public DadosFirma getDadosReconhecimentoFirmaComprador() { return dadosReconhecimentoFirmaComprador; }
    public void setDadosReconhecimentoFirmaComprador(DadosFirma dadosReconhecimentoFirmaComprador) { this.dadosReconhecimentoFirmaComprador = dadosReconhecimentoFirmaComprador; }
}
