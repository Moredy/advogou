
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Briefcase, Gavel, HandshakeIcon, MessageSquare, FileText, Shield, Check } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from "@/integrations/supabase/client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { createLead } from '@/api/createLeadFunction';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Form schema for validation
const phoneSchema = z.object({
    phone: z
        .string()
        .min(10, { message: 'O telefone deve ter pelo menos 10 dígitos' })
        .max(15, { message: 'O telefone não deve ter mais de 15 dígitos' })
        .regex(/^[\d\s()-]+$/, { message: 'Formato de telefone inválido' }),
});

// Lawyer Card Component
interface BadgeProps {
    icon: React.ReactNode;
    text: string;
}

const Badge: React.FC<BadgeProps> = ({ icon, text }) => {
    return (
        <div className="inline-flex items-center gap-1.5 bg-yellow-400 bg-opacity-20 text-yellow-400 px-3 py-1 rounded text-sm">
            {icon}
            <span>{text}</span>
        </div>
    );
};


interface LawyerCardProps {
    image: string;
    name: string;
    role: string;
    quote: string;
    badges: BadgeProps[];
}

const LawyerCard: React.FC<LawyerCardProps> = ({ image, name, role, quote, badges }) => {
    return (
        <Card className="bg-white/5 max-w-[350px] backdrop-blur-sm border-white/10 hover:border-[#9b87f5]/30 transition-all duration-300 overflow-hidden">
            <div className="h-64 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
                <p className="text-yellow-400 mb-4">{role}</p>
                <p className="text-juris-text text-opacity-90 mb-4">
                    {quote}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                    {badges.map((badge, index) => (
                        <Badge key={index} icon={badge.icon} text={badge.text} />
                    ))}
                </div>
            </div>
        </Card>
    );
};

const TrabalhistaExpress: React.FC = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Create form
    const form = useForm<z.infer<typeof phoneSchema>>({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
            phone: '',
        },
    });

    const findMatchingLawyer = async (areaName: string) => {
        try {
            // Verificamos se o cliente prefere atendimento feminino
            const prefereAdvogada = 'nao'
            //selections.prefFeminina === 'sim';

            // Base da consulta
            let query = supabase
                .from('lawyers')
                .select('id, name, email, specialty, gender, phone',)
                .eq('status', 'approved')  // Somente advogados aprovados pelo admin
                .eq('subscription_active', true)  // Com assinatura ativa
                .neq('email', 'admin@jurisquick.com')  // Excluir o email do administrador
                .not('phone', 'is', null); // Excluir advogados sem número de telefone

            // Agora podemos usar o filtro de gênero pois a coluna existe no banco
            if (prefereAdvogada) {
                query = query.eq('gender', 'feminino');
            }

            // Finalizar a consulta ordenando por data de criação
            const { data: lawyers, error: queryError } = await query.order('created_at', { ascending: false });

            if (queryError) {
                console.error('Erro ao consultar advogados:', queryError);
                throw queryError;
            }

            console.log('Todos advogados aprovados:', lawyers);

            if (!lawyers || lawyers.length === 0) {
                console.log("Nenhum advogado aprovado encontrado");
                return null;
            }

            // Primeiro filtro: advogados com a especialidade exata
            let exactMatches = lawyers.filter(lawyer =>
                lawyer.specialty && lawyer.specialty.toLowerCase() === areaName.toLowerCase()
            );

            console.log(`Advogados com especialidade exata "${areaName}":`, exactMatches);

            // Se encontrarmos correspondências exatas, usaremos esses advogados
            if (exactMatches.length > 0) {
                const selectedLawyer = exactMatches[Math.floor(Math.random() * exactMatches.length)];
                console.log("Advogado selecionado com match exato:", selectedLawyer);
                return selectedLawyer;
            }

            // Segundo filtro: busca por palavras-chave na especialidade
            const keywords = areaName.split(' ');
            let partialMatches = lawyers.filter(lawyer =>
                lawyer.specialty && keywords.some(keyword =>
                    lawyer.specialty.toLowerCase().includes(keyword.toLowerCase())
                )
            );

            console.log(`Advogados com match parcial para "${areaName}":`, partialMatches);

            // Se encontrarmos correspondências parciais, usaremos esses advogados
            if (partialMatches.length > 0) {
                const selectedLawyer = partialMatches[Math.floor(Math.random() * partialMatches.length)];
                console.log("Advogado selecionado com match parcial:", selectedLawyer);
                return selectedLawyer;
            }

            // Se não houver correspondências, selecionamos um advogado aleatório dentre os aprovados
            const selectedLawyer = lawyers[Math.floor(Math.random() * lawyers.length)];
            console.log("Advogado selecionado aleatoriamente (sem match):", selectedLawyer);
            return selectedLawyer;
        } catch (error) {
            console.error('Erro ao buscar advogados:', error);
            return null;
        }
    };
    const onSubmit = async (data: z.infer<typeof phoneSchema>) => {
        setIsSubmitting(true);

        try {
            // Create a simplified lead with just the phone number
            const matchingLawyer = await findMatchingLawyer('Direito Trabalhista');

            const result = await createLead({
                lawyer_id: matchingLawyer.id,
                client_name: 'Não informado',
                client_email: `cliente_${new Date().getTime()}@example.com`,
                client_phone: data.phone,
                case_area: 'Direito Trabalhista'.toLowerCase(),
                description: 'Cliente solicitou contato rápido através da página de acesso rapido.',
                status: 'pending'
            });



            if (result.error) {
                throw new Error(result.error.message || 'Erro ao enviar seus dados');
            }

            // Show success message
            toast({
                title: 'Solicitação enviada com sucesso!',
                description: 'Um advogado trabalhista entrará em contato em breve.',
            });

         

            // Navigate to thank you page or home page
            setTimeout(() => {
                form.reset();
                window.open(`https://wa.me/${matchingLawyer.phone}?text=Ol%C3%A1%2C%20fui%20indicado%20pela%20Advogou.com%2C%20pode%20me%20ajudar%20com%20meu%20problema%20trabalhista%3F`)
            }, 500);
        } catch (err) {
            console.error('Erro ao enviar solicitação:', err);
            toast({
                title: 'Erro ao enviar solicitação',
                description: 'Por favor, tente novamente mais tarde.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPhoneNumber = (value: string) => {
        if (!value) return '';
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}${numbers.slice(7, 11)}`;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-juris-dark to-black">
            <Header />

            <main className="flex-grow container-custom py-8 md:py-16">
                {/* Hero Section */}
                <motion.div
                    className="text-left px-[30px] md:text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-white">
                        Sofreu Injustiça no Trabalho?
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-juris-text text-opacity-90">
                        Receba orientação de um de nossos advogados
                    </p>
                </motion.div>

                {/* Simple Form */}
                <motion.div
                    className="max-w-lg mx-auto mb-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="backdrop-blur-sm px-8 rounded-lg ">


                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-white">Telefone com WhatsApp</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center w-full bg-white bg-opacity-5 border border-white border-opacity-20 rounded-md">
                                                    <div className="px-3">
                                                        <Phone className="text-white" size={18} />
                                                    </div>
                                                    <Input
                                                        placeholder="(11) 95555-5555"
                                                        className="bg-transparent border-none text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none w-full"
                                                        required
                                                        type="tel"
                                                        value={formatPhoneNumber(field.value)}
                                                        onChange={(e) => {
                                                            const numbers = e.target.value.replace(/\D/g, '').slice(0, 11);
                                                            field.onChange(numbers);
                                                        }}
                                                        maxLength={15}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />



                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium flex items-center justify-center gap-2 py-6"

                                >
                                    {isSubmitting ? (
                                        "Enviando..."
                                    ) : (
                                        <>
                                            Quero falar com um advogado
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <p className="text-sm text-gray-400 mt-4 text-center">
                            Garantimos total sigilo e proteção dos seus dados
                        </p>
                    </div>
                </motion.div >

                {/* NEW SECTION: Team experts */}
                < motion.div
                    className="mt-16 md:mt-24 mb-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h2 className="text-2xl md:text-3xl font-medium mb-8 text-white text-center">
                        Profissional destaque
                    </h2>

                    <div className="flex justify-center">
                        <LawyerCard
                            image="https://images.unsplash.com/photo-1615348411055-3492a2c76ca2?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            name="Dra. Márcia Maria"
                            role="Especialista em Direito Trabalhista"
                            quote="15 anos defendendo direitos de trabalhadores com mais de 800 casos bem-sucedidos. Especializado em causas complexas e disputas trabalhistas de alto valor."
                            badges={[
                                { icon: <Gavel size={14} />, text: "15+ anos de experiência" },
                                { icon: <FileText size={14} />, text: "800+ casos resolvidos" }
                            ]}
                        />


                    </div>
                </motion.div >

                {/* CTA para começar */}
                < motion.div
                    className="text-left mt-16 mb-16 p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                >
                    <h2 className="text-2xl font-medium mb-4 text-white">
                        Precisa de orientação?
                    </h2>
                    <p className="text-juris-text text-opacity-80 mb-8 max-w-2xl mx-auto">
                        Agende uma conversa sem compromisso para tirar suas dúvidas a respeito dos seus direitos no trabalho
                    </p>

                    <Button onClick={()=> window.open('https://wa.me/5511913192435?text=Ol%C3%A1%2C%20fui%20indicado%20pela%20Advogou.com%2C%20pode%20me%20ajudar%20com%20meu%20problema%20trabalhista%3F')} className="w-full mb-5 bg-yellow-400 hover:bg-yellow-500 text-black font-medium flex items-center justify-center gap-2 py-6">
                        Encontrar um advogado
                    </Button>
                </motion.div >

                {/* FAQ - Perguntas Frequentes */}
                < motion.div
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                >
                    <h2 className="text-xl md:text-3xl font-medium mb-6 text-white text-center">
                        Dúvidas frequentes
                    </h2>

                    <Accordion type="single" collapsible className="card-custom">
                        <AccordionItem value="item-1" className="border-white/10">
                            <AccordionTrigger className="text-white hover:no-underline">
                                Quais são os direitos de quem trabalha sem carteira assinada?
                            </AccordionTrigger>
                            <AccordionContent className="text-juris-text">
                                Mesmo sem carteira assinada, o trabalhador tem direito a todos os benefícios legais, como férias, 13º salário, FGTS, horas extras, e adicional noturno. É possível acionar a Justiça para regularizar a situação e receber os valores devidos.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2" className="border-white/10">
                            <AccordionTrigger className="text-white hover:no-underline">
                                Quanto tempo tenho para entrar com um processo trabalhista?
                            </AccordionTrigger>
                            <AccordionContent className="text-juris-text">
                                O prazo é de até 2 anos após o fim do contrato de trabalho, cobrando valores referentes aos últimos 5 anos.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3" className="border-white/10">
                            <AccordionTrigger className="text-white hover:no-underline">
                                Fui demitido sem justa causa. Quais são meus direitos?
                            </AccordionTrigger>
                            <AccordionContent className="text-juris-text">
                                Você tem direito a aviso prévio, saldo de salário, férias acrescidas de um terço, 13º salário proporcional, multa de 40% sobre o FGTS, saque do FGTS e seguro-desemprego.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4" className="border-white/10">
                            <AccordionTrigger className="text-white hover:no-underline">
                                E se eu não gostar das propostas recebidas?
                            </AccordionTrigger>
                            <AccordionContent className="text-juris-text">
                                Você não tem nenhuma obrigação de aceitar as propostas. Se preferir, pode solicitar novas propostas ou refinar sua busca para encontrar o advogado ideal para seu caso.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-5" className="border-white/10">
                            <AccordionTrigger className="text-white hover:no-underline">
                            Sofri um acidente de trabalho. Quais são meus direitos?
                            </AccordionTrigger>
                            <AccordionContent className="text-juris-text">
                            Se você sofreu um acidente durante o trabalho ou no trajeto entre sua casa e a empresa, tem direito a estabilidade no emprego por 12 meses após o retorno, auxílio-doença acidentário (caso precise se afastar por mais de 15 dias), além de eventual indenização por danos morais ou materiais, se houver culpa da empresa. A empresa também deve emitir a CAT (Comunicação de Acidente de Trabalho), mesmo que o acidente pareça leve.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </motion.div >



                {/* Why Choose Us Section */}
                < motion.div
                    className="mt-26 md:mt-36"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >

                </motion.div >


            </main >
            <a
                href="https://wa.me/5511967801655?text=Olá, preciso de ajuda com um problema trabalhista."
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
                aria-label="Fale conosco no WhatsApp"
            >
                <WhatsAppIcon sx={{ fontSize: '40px' }} />
            </a>
            <Footer />
        </div >
    );
};

// Feature card component
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <div className="bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10 hover:border-juris-accent transition-crs">
            <div className="text-juris-accent mb-4 p-3 bg-juris-accent bg-opacity-10 inline-block rounded-lg">
                {icon}
            </div>
            <h3 className="text-xl font-medium mb-3 text-white">{title}</h3>
            <p className="text-juris-text text-opacity-80">
                {description}
            </p>
        </div>
    );
};

export default TrabalhistaExpress;
