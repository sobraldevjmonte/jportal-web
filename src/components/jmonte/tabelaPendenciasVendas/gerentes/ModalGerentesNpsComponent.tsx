import { FilterOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Modal, Skeleton, Spin, Table, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import RtService from '../../../../service/RtService';

import isBetween from 'dayjs/plugin/isBetween';
import TabelaProdutosGerentesComponent from './TabelaProdutosGerentesComponent';
dayjs.extend(isBetween);
const { RangePicker } = DatePicker;




const service = new RtService()

interface PreVendasType {
    key: number;
    np: string; //ok
    data_pre: string; //ok
    nome_cliente: string; //ok
    vendedor: string; //ok
    loja: string; //ok
    idIndicador: string; //ok
    comissao: number; //ok
    perc_ap: number;
    total_vlr_tabela: number;
    total_vlr_base_pp_lista: number;
    total_lb_percentual: number;
    valor_pp: number;
    vlr_fator_financeiro: number;
    vlr_lb_fator_financeiro: number;
    vlr_diff_tab: number;
    vlr_base_pp: number;
    plano: string; //ok
}

interface SelecaoNpModalProps {
    visible: boolean;
    onClose: () => void;
    idCliente: number;
    nomeCliente: string;
}

const ModalGerentesNpsComponent: React.FC<SelecaoNpModalProps> = ({ visible, onClose, idCliente, nomeCliente }) => {
    const [dados, setDados] = useState<PreVendasType[]>([]);
    const [dadosOriginais, setDadosOriginais] = useState<PreVendasType[]>([]);
    const [quantidade, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log('idCliente modal: ' + idCliente)
        if (visible) {
            _listaPendenciasVendas();
        }
        setQuantidade(0)
    }, [visible, idCliente])

    async function _listaPendenciasVendas() {

        setLoading(true);
        try {
            let rs = await service.listaPreVendasDoCliente(idCliente);
            console.log(rs.data.prevendas)
            setDados(rs.data.prevendas)
            setDadosOriginais(rs.data.prevendas);
            setQuantidade(rs.data.quantidade)
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    }

    const [filters, setFilters] = useState<FilterType[]>([]);
    const [filterLoading, setFilterLoading] = useState(false); // Estado para controlar o loading do filtro
    const [filterValue, setFilterValue] = useState<string>('');
    const applyFilter = (value: string) => {
        setFilterLoading(true);
        try {
            const filteredData = dados.filter(item =>
                value.length > 0
                    ? item.np.includes(value)
                    : true // Se o valor do filtro estiver vazio, exibe todos os dados
            );

            // Verifica se o valor digitado corresponde exatamente a algum registro
            const exactMatch = filteredData.some(item => item.np === value);

            // Se houver uma correspondência exata, filtra apenas ela
            if (exactMatch) {
                const exactFilteredData = filteredData.filter(item => item.np === value);
                setDados(exactFilteredData);
            } else {
                setDados(filteredData);
            }

            setFilters(generateFilters(filteredData));
        } catch (error) {
            console.error('Erro ao aplicar filtro:', error);
        } finally {
            setFilterLoading(false);
        }
    };

    const generateFilters = (listaNps: PreVendasType[]) => {
        const uniqueNp: string[] = [...new Set(listaNps.map(item => item.np))];
        return uniqueNp.map(np => ({
            text: np,
            value: np,
        }));
    };

    interface FilterType {
        text: string;
        value: string;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilterValue(value);
        applyFilter(value); // Aplica o filtro imediatamente após capturar o valor
    };

    const clearFilter = () => {
        setFilterLoading(true);
        try {
            setFilterValue(''); // Limpa o valor do filtro
            setDados(dadosOriginais); // Restaura os dados originais
            setFilters(generateFilters(dadosOriginais)); // Atualiza os filtros com base nos dados originais
        } catch (error) {
            console.error('Erro ao limpar filtro:', error);
        } finally {
            setFilterLoading(false);
        }
    };
    const columns: TableColumnsType<PreVendasType> = [
        {
            title: 'Np', dataIndex: 'np', key: 'np',
            filterDropdown: (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Filtrar por NP"
                        value={filterValue}
                        onChange={handleInputChange}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        onClick={clearFilter}
                        size="small"
                        type="link"
                    >
                        Limpar Filtro
                    </Button>
                </div>
            ),
            filterIcon: <Spin spinning={filterLoading}><FilterOutlined style={{ color: filterLoading ? '#1890ff' : undefined }} /></Spin>,
        },
        {
            title: 'Data Np',
            dataIndex: 'data_pre',
            key: 'data_pre',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
                <div style={{ padding: 8 }}>
                    <RangePicker
                        format="DD/MM/YYYY"
                        value={selectedKeys.length === 2 ? [dayjs(selectedKeys[0], 'DD/MM/YYYY'), dayjs(selectedKeys[1], 'DD/MM/YYYY')] : null}
                        onChange={(dates) => {
                            if (dates && dates.length === 2) {
                                const [start, end] = dates;
                                if (start && end) {
                                    setSelectedKeys([`${start.format('DD/MM/YYYY')},${end.format('DD/MM/YYYY')}`]);
                                } else {
                                    setSelectedKeys([]);
                                }
                            } else {
                                setSelectedKeys([]);
                            }
                            confirm();
                        }}
                        style={{ width: '100%', marginBottom: 8 }}
                        placeholder={['Data Início', 'Data Fim']}
                    />
                    <Button
                        onClick={() => {
                            clearFilters();
                            confirm();
                        }}
                        size="small"
                        type="link"
                    >
                        Limpar Filtro
                    </Button>
                </div>
            ),
            onFilter: (value, record: PreVendasType) => {
                if (!value) return true;
                const [startDate, endDate] = (value as string).split(',');
                const recordDate = dayjs(record.data_pre, 'DD/MM/YYYY');
                return recordDate.isBetween(dayjs(startDate, 'DD/MM/YYYY'), dayjs(endDate, 'DD/MM/YYYY'), 'day', '[]');
            },
            // onFilter: (value: string, record: PreVendasType) => {
            //     if (!value) return true;
            //     const [startDate, endDate] = value.split(',');
            //     const recordDate = dayjs(record.data_pre, 'DD/MM/YYYY');
            //     return recordDate.isBetween(dayjs(startDate, 'DD/MM/YYYY'), dayjs(endDate, 'DD/MM/YYYY'), 'day', '[]');
            // },

            // onFilter: (value, record) => {
            //     return record.profissional.toUpperCase().includes(value.toString());
            // },


        },
        { title: 'Loja', dataIndex: 'loja', key: 'loja', width: '100px' },
        { title: 'Cliente', dataIndex: 'nome_cliente', key: 'nome_cliente' },
        { title: 'Vendedor', dataIndex: 'vendedor', key: 'vendedor' },
        { title: 'F.Pgto', dataIndex: 'plano', key: 'plano' },
        { title: 'Vlr.Venda', dataIndex: 'ptotal', key: 'ptotal', render: (text: string) => <span>R$ {text}</span> },
        { title: 'Vlr.Tabela.', dataIndex: 'total_vlr_tabela', key: 'total_vlr_tabela', render: (text: string) => <span>R$ {text}</span> },
        // { title: 'Vlr.Base PP', dataIndex: 'total_vlr_base_pp_lista', key: 'total_vlr_base_pp_lista', render: (text: string) => <span>R$ {text}</span> },
        // { title: '(%)L.B.', dataIndex: 'total_lb_percentual', key: 'cod_indica_pre', align: 'right', render: (text: string) => <span >{text}</span> },
        // { title: '(%)FatorFin.', dataIndex: 'vlr_fator_financeiro', key: 'vlr_fator_financeiro', align: 'right', render: (text: string) => <span >{text}</span> },
        // { title: '(%)LB.Fator', dataIndex: 'vlr_lb_fator_financeiro', key: 'vlr_lb_fator_financeiro', align: 'right', render: (text: string) => <span >{text}</span> },
        // { title: '(%)Diff.Tab.', dataIndex: 'vlr_diff_tab', key: 'vlr_diff_tab', align: 'right', render: (text: string) => <span >{text}</span> },
        // { title: 'VL.PP.', dataIndex: 'valor_pp', key: 'valor_pp', align: 'right', render: (text: string) => <span >{text}</span> },
    ];

    //***************** Inserindo Componente TabelaPendenciasVendasVendedoreNps  ******************/
    const expandedRowRender = (record: any) => {
        let x = record.np
        console.log(x)
        return <TabelaProdutosGerentesComponent numeroNp={x} />;
    };


    return (
        <Modal
            title={`Lista de NPs do Cliente: ${nomeCliente} - Quantidade: ${quantidade}`}
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={1800}
        >
            {loading ? (
                <Skeleton
                    active
                    style={{ backgroundColor: '#fff' }} // Cor de fundo para todo o Skeleton
                    paragraph={{ rows: 4, style: { backgroundColor: '#fff' } }} // Cor para as linhas
                    title={{ style: { backgroundColor: '#fff' } }} // Cor para o título
                />
            ) : (
                <Table
                    columns={columns}
                    dataSource={dados}
                    rowKey={(record) => record.np}
                    pagination={{
                        //defaultPageSize: 5, // Define o tamanho padrão da página
                        showSizeChanger: true, // Exibe o seletor de tamanho da página
                        pageSizeOptions: ['10', '20', '30'], // Opções de tamanho de página disponíveis
                        showQuickJumper: true, // Exibe o campo de navegação rápida
                        showTotal: (total, range) => `Mostrando ${range[0]}-${range[1]} de ${total} Pré Vendas`, // Exibe informações sobre o total de registros
                    }}
                    expandedRowRender={expandedRowRender}
                />
            )}
        </Modal>
    );
};

export default ModalGerentesNpsComponent;
