"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const schema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  telefone: z.string().min(8),
  idade: z.coerce.number().min(10),
  genero: z.string(),
  filhos: z.string(),
  estado: z.string(),
  trabalha: z.string(),
  formacao: z.string(),
  equipamentos: z.string(),
  disponibilidadeAulas: z.string(),
  horarioAulas: z.string(),
  aprendizado: z.string().optional(),
  nivel: z.string(),
  motivacao: z.string().min(10),
  disponibilidade: z.string(),
  salario: z.string(),
  linkedin: z.string().optional(),
  curriculo: z.any().optional(),
});

export default function Page() {
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<null | { tipo: "ok" | "erro"; texto: string }>(null);
  const form = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    setEnviando(true);
    setMensagem(null);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'curriculo' && data[key] && data[key].length > 0) {
          formData.append('curriculo', data[key][0]);
        } else if (key !== 'curriculo') {
          formData.append(key, data[key]);
        }
      });

      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Erro na API");
      setMensagem({ tipo: "ok", texto: "✅ Candidatura enviada com sucesso!" });
      form.reset();
    } catch {
      setMensagem({ tipo: "erro", texto: "❌ Erro ao enviar. Tente novamente." });
    } finally {
      setEnviando(false);
      setTimeout(() => setMensagem(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-2 text-gray-800"
        >
          Vaga para Desenvolvedor(a) Júnior / Pleno
        </motion.h1>

        <p className="text-center text-gray-600 mb-6">
          🏢 Atuação presencial (Segunda a Sexta, das 08h às 18h).<br />
          Um ambiente ágil, acolhedor e focado no seu desenvolvimento — para você dar o próximo passo na sua carreira de forma tranquila e com muitos projetos!
        </p>

        {mensagem && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center p-3 mb-4 rounded-md ${mensagem.tipo === "ok" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
          >
            {mensagem.texto}
          </motion.div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Accordion type="single" collapsible defaultValue="pessoal">
            {/* 🧑‍💻 INFORMAÇÕES PESSOAIS */}
            <AccordionItem value="pessoal">
              <AccordionTrigger>🧑‍💻 Informações Pessoais</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <Label>Nome completo</Label>
                <Input {...form.register("nome")} required />

                <Label>Email</Label>
                <Input type="email" {...form.register("email")} required />

                <Label>Anexe seu Currículo (PDF) - Opcional, mas recomendado!</Label>
                <Input type="file" accept=".pdf" {...form.register("curriculo")} />

                <Label>Telefone / WhatsApp</Label>
                <Input {...form.register("telefone")} required />

                <Label>Idade</Label>
                <Input type="number" {...form.register("idade")} required />

                <Label>Gênero</Label>
                <Select onValueChange={(v) => form.setValue("genero", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mulher">Mulher</SelectItem>
                    <SelectItem value="Homem">Homem</SelectItem>
                    <SelectItem value="Outro">Prefiro não dizer</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Você tem filhos?</Label>
                <Select onValueChange={(v) => form.setValue("filhos", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Não">Não</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Cidade / Estado</Label>
                <Input {...form.register("estado")} placeholder="Ex: Recife - PE" required />
              </AccordionContent>
            </AccordionItem>

            {/* 💼 SITUAÇÃO ATUAL */}
            <AccordionItem value="situacao">
              <AccordionTrigger>💼 Situação Atual</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <Label>Atualmente você trabalha?</Label>
                <Select onValueChange={(v) => form.setValue("trabalha", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim, na área de TI">Sim, na área de TI</SelectItem>
                    <SelectItem value="Sim, em outra área">Sim, em outra área</SelectItem>
                    <SelectItem value="Não estou trabalhando">Não estou trabalhando</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Formação (escolaridade atual)</Label>
                <Select onValueChange={(v) => form.setValue("formacao", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cursando Superior (TI ou exatas)">Cursando Superior (TI ou exatas)</SelectItem>
                    <SelectItem value="Superior Completo (TI ou exatas)">Superior Completo (TI ou exatas)</SelectItem>
                    <SelectItem value="Ensino Médio / Curso Técnico">Ensino Médio / Curso Técnico</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Você possui computador ou notebook próprio?</Label>
                <Select onValueChange={(v) => form.setValue("equipamentos", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sim, pessoal">Sim, tenho um computador pessoal</SelectItem>
                    <SelectItem value="Compartilhado">Uso um compartilhado</SelectItem>
                    <SelectItem value="Não">Não possuo computador</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            {/* 📚 DISPONIBILIDADE E INTERESSES */}
            <AccordionItem value="aulas">
              <AccordionTrigger>🕒 Disponibilidade e Interesses</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <Label>Disponibilidade de jornada</Label>
                <Select onValueChange={(v) => form.setValue("disponibilidadeAulas", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Integral (8h/dia)">Integral (8h/dia - modalidade Pleno/Júnior)</SelectItem>
                    <SelectItem value="Meio período (4h a 6h/dia)">Meio período (4h a 6h - modalidade Júnior)</SelectItem>
                    <SelectItem value="Outro">Outro (menos tempo, etc.)</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Melhores turnos para reuniões/syncs</Label>
                <Select onValueChange={(v) => form.setValue("horarioAulas", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manhã">Manhã</SelectItem>
                    <SelectItem value="Tarde">Tarde</SelectItem>
                    <SelectItem value="Noite">Noite</SelectItem>
                    <SelectItem value="Flexível">Horário flexível</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Frameworks/Linguagens que domina ou mais se interessa</Label>
                <Textarea {...form.register("aprendizado")} placeholder="Ex: React, Next.js, Node.js, Python, TypeScript..." />
              </AccordionContent>
            </AccordionItem>

            {/* 👨‍💻 PERFIL TÉCNICO */}
            <AccordionItem value="perfil">
              <AccordionTrigger>👨‍💻 Perfil Técnico e Motivacional</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <Label>Nível de experiência</Label>
                <Select onValueChange={(v) => form.setValue("nivel", v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Júnior">Júnior (Possuo vivência profissional inicial ou projetos avançados)</SelectItem>
                    <SelectItem value="Pleno">Pleno (Tenho experiência consolidada e autonomia em projetos)</SelectItem>
                  </SelectContent>
                </Select>

                <Label>Por que você quer atuar nesta vaga?</Label>
                <Textarea {...form.register("motivacao")} required />

                <Label>Qual a sua expectativa de horário / dedicação diária?</Label>
                <Input {...form.register("disponibilidade")} placeholder="Ex: 4h diárias, 6h diárias..." required />

                <Label>Qual a sua pretensão salarial? (Insira valores mensais ou valor hora)</Label>
                <Textarea {...form.register("salario")} required />

                <Label>LinkedIn, GitHub ou portfólio (opcional)</Label>
                <Input {...form.register("linkedin")} placeholder="Cole aqui o link, se tiver" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" disabled={enviando} className="w-full mt-4">
              {enviando ? "Enviando..." : "Enviar Candidatura"}
            </Button>
          </motion.div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          © 2025 - Oportunidade de aprendizado em programação |{" "}
          <a
            href="https://alessandrosantos.dev/"
            target="_blank"
            className="text-blue-600 font-medium"
          >
            Alessandro Santos
          </a>
        </p>
      </motion.div>
    </div>
  );
}
