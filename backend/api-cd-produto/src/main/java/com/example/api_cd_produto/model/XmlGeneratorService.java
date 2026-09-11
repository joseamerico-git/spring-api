package com.example.api_cd_produto.model;

import java.util.List;

public class XmlGeneratorService {

    public String gerarXmlVeiculos(List<Veiculo> listaVeiculos) {
        StringBuilder xml = new StringBuilder();
        
        // Cabeçalho e tag raiz com os schemas de validação da SEFAZ
        xml.append("<?xml version=\"1.0\"?>\n");
        xml.append("<veiculos xmlns:xsi=\"http://w3.org\"\n");
        xml.append("xsi:noNamespaceSchemaLocation=\"http://fazenda.sp.gov.br\">\n");

        // Percorre a lista gerando as tags de cada veículo
        for (Veiculo v : listaVeiculos) {
            xml.append("  <veiculo>\n");
            xml.append("    <renavam>").append(v.getRenavam()).append("</renavam>\n");
            xml.append("    <placa>").append(v.getPlaca()).append("</placa>\n");
            xml.append("    <nroEspelho>").append(v.getNroEspelho()).append("</nroEspelho>\n");
            xml.append("    <dataVenda>").append(v.getDataVenda()).append("</dataVenda>\n");
            xml.append("    <cnpjCartorio>").append(v.getCnpjCartorio()).append("</cnpjCartorio>\n");
            xml.append("    <cpfResponsavel>").append(v.getCpfResponsavel()).append("</cpfResponsavel>\n");
            xml.append("    <nomeArquivoP7S>").append(v.getNomeArquivoP7S()).append("</nomeArquivoP7S>\n");
            xml.append("    <conteudoArquivoP7S>").append(v.getConteudoArquivoP7S()).append("</conteudoArquivoP7S>\n");
            xml.append("    <caminhoArquivoP7S>").append(v.getCaminhoArquivoP7S()).append("</caminhoArquivoP7S>\n");
            xml.append("    <tamanhoArquivoP7S>").append(v.getTamanhoArquivoP7S()).append("</tamanhoArquivoP7S>\n");
            
            // Bloco Dados Comprador
            if (v.getDadosComprador() != null) {
                xml.append("    <dadosComprador>\n");
                xml.append("      <tipoDocumento>").append(v.getDadosComprador().getTipoDocumento()).append("</tipoDocumento>\n");
                xml.append("      <documento>").append(v.getDadosComprador().getDocumento()).append("</documento>\n");
                xml.append("      <descricaoDocumento>").append(v.getDadosComprador().getDescricaoDocumento()).append("</descricaoDocumento>\n");
                xml.append("      <endereco>").append(v.getDadosComprador().getEndereco()).append("</endereco>\n");
                xml.append("      <numero>").append(v.getDadosComprador().getNumero()).append("</numero>\n");
                xml.append("      <complemento>").append(v.getDadosComprador().getComplemento()).append("</complemento>\n");
                xml.append("      <bairro>").append(v.getDadosComprador().getBairro()).append("</bairro>\n");
                xml.append("      <cep>").append(v.getDadosComprador().getCep()).append("</cep>\n");
                xml.append("      <uf>").append(v.getDadosComprador().getUf()).append("</uf>\n");
                xml.append("      <municipio>").append(v.getDadosComprador().getMunicipio()).append("</municipio>\n");
                xml.append("    </dadosComprador>\n");
            }

            // Bloco Firma Vendedor
            if (v.getDadosReconhecimentoFirmaVendedor() != null) {
                xml.append("    <dadosReconhecimentoFirmaVendedor>\n");
                xml.append("      <livro>").append(v.getDadosReconhecimentoFirmaVendedor().getLivro()).append("</livro>\n");
                xml.append("      <folha>").append(v.getDadosReconhecimentoFirmaVendedor().getFolha()).append("</folha>\n");
                xml.append("      <dataReconhecimentoFirma>").append(v.getDadosReconhecimentoFirmaVendedor().getDataReconhecimentoFirma()).append("</dataReconhecimentoFirma>\n");
                xml.append("    </dadosReconhecimentoFirmaVendedor>\n");
            }

            // Bloco Firma Comprador
            if (v.getDadosReconhecimentoFirmaComprador() != null) {
                xml.append("    <dadosReconhecimentoFirmaComprador>\n");
                xml.append("      <livro>").append(v.getDadosReconhecimentoFirmaComprador().getLivro()).append("</livro>\n");
                xml.append("      <folha>").append(v.getDadosReconhecimentoFirmaComprador().getFolha()).append("</folha>\n");
                xml.append("      <dataReconhecimentoFirma>").append(v.getDadosReconhecimentoFirmaComprador().getDataReconhecimentoFirma()).append("</dataReconhecimentoFirma>\n");
                xml.append("    </dadosReconhecimentoFirmaComprador>\n");
            }

            xml.append("  </veiculo>\n");
        }

        xml.append("</veiculos>");
        return xml.toString();
    }
}
