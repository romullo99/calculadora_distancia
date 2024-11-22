# Distância Entre Localizações (React Native App)

Este projeto é um aplicativo em **React Native** que permite aos usuários calcular a distância entre a sua localização atual e um endereço fornecido via CEP (Código de Endereçamento Postal), aplicação também armazena os cálculos em um banco de dados para consulta futura, possibilitando o gerenciamento de históricos de buscas. Além disso, o aplicativo exibe a localização em um mapa e fornece informações detalhadas sobre o endereço de origem e destino.

## Funcionalidades

**Obter Localização Atual**: Ao clicar no botão "Obter Minha Localização", o aplicativo solicita permissão para acessar a localização do dispositivo e exibe as coordenadas no mapa.

**Buscar Endereço por CEP**: O usuário pode inserir um CEP para buscar o endereço correspondente, e o aplicativo calcula a distância entre a localização atual e o endereço informado.

**Exibição de Mapa**: Exibe um mapa interativo mostrando a localização atual do usuário e o endereço buscado pelo CEP.

**Cálculo de Distância**: A distância entre a localização atual e o endereço informado é calculada e exibida em quilômetros (km).

**Limpeza dos Campos**: O usuário pode limpar os campos e reiniciar a busca a qualquer momento.

## Como Funciona

**Localização Atual**: O aplicativo solicita permissão para acessar a localização do dispositivo. Caso a permissão seja concedida, ele exibe a localização atual no mapa.

**Busca de CEP**: O usuário insere um CEP válido e clica em "Buscar Endereço e Calcular Distância". O aplicativo utiliza a API **ViaCEP** para obter o endereço completo e converte o endereço em coordenadas geográficas.

**Cálculo de Distância**: A distância entre a localização atual e o endereço é calculada usando a fórmula de **Haversine**, que calcula a distância entre dois pontos na superfície da Terra.

**Exibição no Mapa**: A localização atual e o endereço do CEP são marcados no mapa com marcadores. O mapa é renderizado com a biblioteca **react-native-maps**.

**Limpeza de Campos**: O botão "Limpar Campos" limpa os dados inseridos e reinicia a aplicação.

## Tecnologias Utilizadas

**React Native**: Para construir o aplicativo móvel.

**Expo Location**: Para acessar a localização do dispositivo.

**axios**: Para fazer requisições HTTP para a API **ViaCEP**.

**react-native-maps**: Para exibir o mapa com a localização e os marcadores.

**Haversine**: Para calcular a distância entre dois pontos geográficos.

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/romullo99/calculadora_distancia/

2. Navegue até o diretório do projeto:
   ```bash
   cd calculadora-distancia

3. Instale as dependências:
   ```bash
   npm install

4. Execute o projeto:
   ```bash
   npx expo start

## Como Usar

   Abra o aplicativo em um dispositivo ou emulador.

   Clique em "Obter Minha Localização" para buscar a localização atual do dispositivo.

   Digite um CEP válido e clique em "Buscar Endereço e Calcular Distância".

   Veja a distância calculada entre sua localização e o endereço do CEP.

   O mapa exibirá a localização atual e o endereço em marcadores.

   Clique em "Limpar Campos" para reiniciar o processo.
   
## Contribuição
   
   Contribuições são bem-vindas! Se você tiver sugestões ou melhorias, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença
   
   Este projeto está licenciado sob a MIT License.
