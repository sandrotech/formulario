"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

type Candidato = {
    nome: string;
    email: string;
    telefone: string;
    idade: number;
    genero: string;
    filhos: string;
    estado: string;
    trabalha: string;
    formacao: string;
    equipamentos: string;
    disponibilidadeAulas: string;
    horarioAulas: string;
    aprendizado?: string;
    nivel: string;
    motivacao: string;
    disponibilidade: string;
    salario: string;
    linkedin?: string;
    dataEnvio: string;
};

export default function Respostas() {
    const [senha, setSenha] = useState("");
    const [autenticado, setAutenticado] = useState(false);
    const [dados, setDados] = useState<Candidato[]>([]);
    const [busca, setBusca] = useState("");
    const [expandido, setExpandido] = useState<number | null>(null);
    const [carregando, setCarregando] = useState(false);

    // filtros
    const [filtroGenero, setFiltroGenero] = useState("Todos");
    const [filtroNivel, setFiltroNivel] = useState("Todos");
    const [filtroAulas, setFiltroAulas] = useState("Todos");
    const [filtroStatus, setFiltroStatus] = useState("Todos");

    // status (localStorage)
    const [statusCandidatos, setStatusCandidatos] = useState<Record<string, string>>({});

    useEffect(() => {
        const stored = localStorage.getItem("statusCandidatos");
        if (stored) setStatusCandidatos(JSON.parse(stored));
    }, []);

    const salvarStatus = (email: string, status: string) => {
        const novos = { ...statusCandidatos, [email]: status };
        setStatusCandidatos(novos);
        localStorage.setItem("statusCandidatos", JSON.stringify(novos));
    };

    const autenticar = async () => {
        if (senha === "zlAleeh1234@") {
            setCarregando(true);
            const res = await fetch("/api/respostas");
            const data = await res.json();
            setDados(data.reverse());
            setAutenticado(true);
            setCarregando(false);
        } else {
            alert("Senha incorreta!");
        }
    };

    const filtrados = dados.filter((c) => {
        const termo = busca.toLowerCase();
        const passaBusca =
            c.nome?.toLowerCase().includes(termo) ||
            c.email?.toLowerCase().includes(termo) ||
            c.estado?.toLowerCase().includes(termo);

        const passaGenero = filtroGenero === "Todos" || c.genero === filtroGenero;
        const passaNivel = filtroNivel === "Todos" || c.nivel === filtroNivel;
        const passaAulas =
            filtroAulas === "Todos" || c.disponibilidadeAulas === filtroAulas;
        const passaStatus =
            filtroStatus === "Todos" ||
            statusCandidatos[c.email] === filtroStatus;

        return passaBusca && passaGenero && passaNivel && passaAulas && passaStatus;
    });

    if (!autenticado)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 p-4">
                <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-center mb-4">🔒 Área Restrita</h2>
                    <Input
                        type="password"
                        placeholder="Digite a senha de acesso"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <Button onClick={autenticar} className="w-full mt-4" disabled={carregando}>
                        {carregando ? "Carregando..." : "Entrar"}
                    </Button>
                    <p className="text-sm text-gray-500 text-center mt-3">
                        Acesso exclusivo para o RH e responsáveis pela triagem
                    </p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 p-6">
            <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                    <h1 className="text-2xl font-bold text-gray-800">📋 Triagem de Candidaturas</h1>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <Input
                            placeholder="Buscar candidato..."
                            className="pl-9"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    <Select value={filtroGenero} onValueChange={setFiltroGenero}>
                        <SelectTrigger><SelectValue placeholder="Gênero" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Mulher">Mulher</SelectItem>
                            <SelectItem value="Homem">Homem</SelectItem>
                            <SelectItem value="Prefiro não dizer">Prefiro não dizer</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filtroNivel} onValueChange={setFiltroNivel}>
                        <SelectTrigger><SelectValue placeholder="Nível técnico" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Sou iniciante total">Iniciante total</SelectItem>
                            <SelectItem value="Já fiz alguns cursos">Já fez alguns cursos</SelectItem>
                            <SelectItem value="Já programei um pouco">Já programei um pouco</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filtroAulas} onValueChange={setFiltroAulas}>
                        <SelectTrigger><SelectValue placeholder="Disponibilidade aulas" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Sim, com certeza">Sim, com certeza</SelectItem>
                            <SelectItem value="Depende do horário">Depende do horário</SelectItem>
                            <SelectItem value="Talvez">Talvez</SelectItem>
                            <SelectItem value="Não tenho disponibilidade">Não disponível</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Aprovado">Aprovado</SelectItem>
                            <SelectItem value="Em análise">Em análise</SelectItem>
                            <SelectItem value="Reprovado">Reprovado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Lista de candidatos */}
                {filtrados.length === 0 && (
                    <p className="text-gray-500 text-center py-10">Nenhuma candidatura encontrada.</p>
                )}

                <div className="space-y-3">
                    <AnimatePresence>
                        {filtrados.map((candidato, i) => {
                            const statusAtual = statusCandidatos[candidato.email] || "Em análise";
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start flex-wrap gap-3">
                                        <div>
                                            <h2 className="font-semibold text-lg text-gray-800">{candidato.nome}</h2>
                                            <p className="text-gray-500 text-sm">{candidato.email}</p>
                                            <div className="mt-1 flex flex-wrap gap-2 text-xs">
                                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{candidato.estado}</span>
                                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">{candidato.nivel}</span>
                                                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{candidato.trabalha}</span>
                                                <span
                                                    className={`px-2 py-0.5 rounded ${statusAtual === "Aprovado"
                                                            ? "bg-green-100 text-green-700"
                                                            : statusAtual === "Reprovado"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {statusAtual}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 items-center">
                                            <Select
                                                value={statusAtual}
                                                onValueChange={(v) => salvarStatus(candidato.email, v)}
                                            >
                                                <SelectTrigger className="h-8 text-sm w-[130px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Em análise">Em análise</SelectItem>
                                                    <SelectItem value="Aprovado">Aprovado</SelectItem>
                                                    <SelectItem value="Reprovado">Reprovado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setExpandido(expandido === i ? null : i)}
                                            >
                                                {expandido === i ? (
                                                    <>
                                                        <ChevronUp className="mr-1 h-4 w-4" /> Fechar
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown className="mr-1 h-4 w-4" /> Ver mais
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Detalhes */}
                                    <AnimatePresence>
                                        {expandido === i && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 text-sm text-gray-700 space-y-2"
                                            >
                                                <div className="grid sm:grid-cols-2 gap-2">
                                                    <p><b>Telefone:</b> {candidato.telefone}</p>
                                                    <p><b>Idade:</b> {candidato.idade}</p>
                                                    <p><b>Gênero:</b> {candidato.genero}</p>
                                                    <p><b>Filhos:</b> {candidato.filhos}</p>
                                                    <p><b>Formação:</b> {candidato.formacao}</p>
                                                    <p><b>Equipamentos:</b> {candidato.equipamentos}</p>
                                                    <p><b>Disponibilidade de aulas:</b> {candidato.disponibilidadeAulas}</p>
                                                    <p><b>Horário preferido:</b> {candidato.horarioAulas}</p>
                                                </div>

                                                {candidato.aprendizado && (
                                                    <p><b>Área de interesse:</b> {candidato.aprendizado}</p>
                                                )}

                                                <p><b>Motivação:</b> {candidato.motivacao}</p>
                                                <p><b>Disponibilidade semanal:</b> {candidato.disponibilidade}</p>
                                                <p><b>Expectativa:</b> {candidato.salario}</p>

                                                {candidato.linkedin && (
                                                    <p>
                                                        <b>Portfólio:</b>{" "}
                                                        <a
                                                            href={candidato.linkedin}
                                                            target="_blank"
                                                            className="text-blue-600 underline"
                                                        >
                                                            {candidato.linkedin}
                                                        </a>
                                                    </p>
                                                )}

                                                <p className="text-xs text-gray-400 mt-2">
                                                    Enviado em: {new Date(candidato.dataEnvio).toLocaleString("pt-BR")}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
