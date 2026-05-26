import { useContext, useEffect, useState, useRef } from "react";
import AnaliseNpService from "../../../../service/AnaliseNpService";
import { Button, Spin, Table, TableColumnsType, Typography } from "antd";
import { UsuarioContext } from "../../../../context/useContext";
import { PrinterOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";

const service = new AnaliseNpService();

interface AnaliseNpProdutosType {
    key: string;
    seq: string;
    codproduto: string;
    produto: string;
    codgrupo: string;
    comprador: string;
    quantidade: number;
    valor_und: number;
    vlr_vendido: number;
    vlr_tabela: number;
    desconto: number;
    imposto: number;
    desp_adm: number;
    fator_financeiro: number;
    lucro: number;
    taxaentrega: number;
}

export default function TabelaAnaliseNpProdutosAdminComponent(props: any) {
    // Inicializar sempre como array vazio para evitar erros de renderização
    const [dados, setDados] = useState<AnaliseNpProdutosType[]>([]);
    const [registros, setQuantidade] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const { idNivelUsuario, subNivel1 } = useContext(UsuarioContext);

    const componentRef = useRef(null);

    async function listaProdutosNp() {
        setLoading(true);
        try {
            let rs = await service.listarProdutosNp(props.np);
            console.log(rs)
            
            // PROTEÇÃO: Verifica se rs, data e a lista existem
            if (rs && rs.data && rs.data.lista_produtos_np) {
                // Filtra qualquer item nulo que possa vir do array antes de setar o estado
                const listaValida = rs.data.lista_produtos_np.filter((item: any) => 
                    item !== null && 
                    typeof item === 'object' && 
                    Object.keys(item).length > 0 // Remove objetos vazios {}
                );
                setDados(listaValida);
                setQuantidade(rs.data.registros || 0);
            } else {
                setDados([]);
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setDados([]); // Em caso de erro (como 401), limpa a tabela
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (props.np) {
            listaProdutosNp();
        }
    }, [props.np]);

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        try {
            const response = await service.gerarPdfProdutosNp(props.np);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Produtos_NP_${props.np}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao baixar o PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const tamFonte = '0.9rem';

    const columns: TableColumnsType<AnaliseNpProdutosType> = [
        { title: 'Cód.', dataIndex: 'codproduto', key: 'codproduto' },
        { title: 'PRODUTO', dataIndex: 'produto', key: 'produto' },
        { title: 'COMPRADOR', dataIndex: 'comprador', key: 'comprador' },
        {
            title: 'QTDE.VND', dataIndex: 'quantidade', key: 'quantidade', align: 'right',
            render: (_, record) => {
                if (!record) return null;
                const valor = parseFloat(record.quantidade?.toString() || "0");
                return <span style={{ fontSize: tamFonte }}>{isNaN(valor) ? "0.00" : valor.toFixed(2)}</span>
            }
        },
        {
            title: 'VLR UNIT', dataIndex: 'valor_und', key: 'valor_und', align: 'right',
            render: (_, record) => {
                if (!record) return null;
                const valor = parseFloat(record.valor_und?.toString() || "0");
                return <span style={{ fontSize: tamFonte }}>{isNaN(valor) ? "0.00" : valor.toFixed(2)}</span>
            }
        },
        {
            title: 'VLR VENDA', dataIndex: 'vlr_vendido', key: 'vlr_vendido', align: 'right',
            render: (_, record) => {
                if (!record) return null;
                const valor = parseFloat(record.vlr_vendido?.toString() || "0");
                return <span style={{ fontSize: tamFonte }}>{isNaN(valor) ? "0.00" : valor.toFixed(2)}</span>
            }
        },
        {
            title: 'VLR TABELA', dataIndex: 'vlr_tabela', key: 'vlr_tabela', align: 'right',
            render: (_, record) => {
                if (!record) return null;
                const valor = parseFloat(record.vlr_tabela?.toString() || "0");
                return <span style={{ fontSize: tamFonte }}>{isNaN(valor) ? "0.00" : valor.toFixed(2)}</span>
            }
        },
        {
            title: 'DIFF.TAB', dataIndex: 'desconto', key: 'desconto', align: 'right',
            render: (_, record) => {
                if (!record) return null;
                const valor = parseFloat(record.desconto?.toString() || "0");
                return <span style={{ fontSize: tamFonte }}>{isNaN(valor) ? "0.00" : valor.toFixed(2)}</span>
            }
        },
        {
            title: 'IMPOSTO', dataIndex: 'imposto', key: 'imposto', align: 'right',
            render: (_, record) => {
                if (!record) return null;
                const valor = parseFloat(record.imposto?.toString() || "0");
                return <span style={{ fontSize: tamFonte }}>{isNaN(valor) ? "0.00" : valor.toFixed(2)}</span>
            }
        },
        {
            title: 'DESP.ADM', dataIndex: 'desp_adm', key: 'desp_adm', align: 'right',
            render: (_, record) => {
                if (!record) return null;
                const valor = parseFloat(record.desp_adm?.toString() || "0");
                return <span style={{ fontSize: tamFonte }}>{isNaN(valor) ? "0.00" : valor.toFixed(2)}</span>
            }
        },
        {
            title: 'FF%', dataIndex: 'fator_financeiro', key: 'fator_financeiro', align: 'right',
            render: (_, record) => {
                if (!record) return null;
                const valor = parseFloat(record.fator_financeiro?.toString() || "0");
                return <span style={{ fontSize: tamFonte }}>{isNaN(valor) ? "0.00" : valor.toFixed(2)}</span>
            }
        },
        ...((idNivelUsuario === 1 || idNivelUsuario === 11 || idNivelUsuario === 9) && subNivel1 === 1
            ? [{
                title: 'LUCRO',
                dataIndex: 'lucro',
                key: 'lucro',
                align: 'right' as const,
                render: (_: any, record: any) => {
                    if (!record) return null;
                    const valor = parseFloat(record.lucro?.toString() || "0");
                    return <span style={{ fontSize: tamFonte }}>{isNaN(valor) ? "0.00" : valor.toFixed(2)}</span>
                },
            }]
            : []
        ),
        {
            title: 'TAXA ENTREGA', dataIndex: 'taxaentrega', key: 'taxaentrega', align: 'right',
            render: (_, record) => {
                if (!record) return null;
                const valor = parseFloat(record.taxaentrega?.toString() || "0");
                return <span style={{ fontSize: tamFonte }}>{isNaN(valor) ? "0.00" : valor.toFixed(2)}</span>
            }
        },
    ];
    return (
        <div style={{ backgroundColor: '#FFFAF0', padding: '10px' }}>
            <Spin spinning={loading} tip="Carregando produtos...">
                <Table
                    columns={columns}
                    dataSource={dados}
                    size="small"
                    bordered
                    // CORREÇÃO CRÍTICA: Uso de Optional Chaining (?.) para evitar o erro de "record is null"
                    rowKey={(record) => record?.key || record?.codproduto || Math.random().toString()}
                    title={() => (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography.Text strong style={{ fontSize: '1.1rem' }}>
                                Produtos da NP {props.np} ({registros})
                            </Typography.Text>
                            <Button
                                icon={<PrinterOutlined />}
                                onClick={handleDownloadPdf}
                                loading={isDownloading}
                            >
                                {isDownloading ? 'Gerando...' : 'Baixar PDF'}
                            </Button>
                        </div>
                    )}
                    pagination={{
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '30'],
                        showTotal: (total, range) => `Mostrando ${range[0]}-${range[1]} de ${total} produtos`,
                    }}
                />
            </Spin>
        </div>
    );
}