
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, Briefcase, Gavel, HandshakeIcon, MessageSquare } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from "@/integrations/supabase/client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createLead } from '@/api/createLeadFunction';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Form schema for validation
const phoneSchema = z.object({
    phone: z
        .string()
        .min(10, { message: 'O telefone deve ter pelo menos 10 dígitos' })
        .max(15, { message: 'O telefone não deve ter mais de 15 dígitos' })
        .regex(/^[\d\s()-]+$/, { message: 'Formato de telefone inválido' }),
});

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
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-2xl md:text-4xl font-semibold mb-4 text-white">
                        Nós podemos te ajudar a recuperar o que é seu
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-juris-text text-opacity-90">
                        Já ajudamos mais de mil pessoas a recuperar seus direitos no trabalho
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
                            Seus dados estão seguros e protegidos.
                        </p>
                    </div>
                </motion.div>

                {/* Why Choose Us Section */}
                <motion.div
                    className="mt-26 md:mt-36"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <h2 className="text-2xl md:text-3xl font-medium mb-8 text-white text-center">
                        Por que escolher o Advogou para questões trabalhistas?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Briefcase />}
                            title="Especialização em Direito do Trabalho"
                            description="Nossos advogados são especialistas em direito trabalhista, com experiência em todos os tipos de causas."
                        />

                        <FeatureCard
                            icon={<MessageSquare />}
                            title="Atendimento Personalizado"
                            description="Entendemos que cada caso é único. Você terá atenção dedicada para seu problema específico."
                        />

                        <FeatureCard
                            icon={<HandshakeIcon />}
                            title="Transparência Total"
                            description="Valores claros seguindo a tabela da OAB. Sem surpresas ou custos ocultos no processo."
                        />

                        <FeatureCard
                            icon={<Gavel />}
                            title="Soluções Eficazes"
                            description="Buscamos os melhores resultados, seja através de acordos ou representação em processos judiciais."
                        />

                        <FeatureCard
                            icon={<Phone />}
                            title="Rapidez no Contato"
                            description="Compromisso de retorno em até 24 horas após seu cadastro. Sua urgência é nossa prioridade."
                        />

                        <FeatureCard
                            icon={<ArrowRight />}
                            title="Processo Simplificado"
                            description="Sem burocracia. Apenas deixe seu telefone e aguarde o contato de um especialista."
                        />
                    </div>
                </motion.div>

                {/* Employment Law Info Section */}
                <motion.div
                    className="mt-16 md:mt-24 bg-white bg-opacity-5 p-8 rounded-lg border border-white border-opacity-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <h2 className="text-2xl md:text-3xl font-medium mb-6 text-white">
                        Direito Trabalhista: Como podemos ajudar
                    </h2>

                    <div className="space-y-6 text-juris-text">
                        <p>
                            Especialistas da Advogou podem auxiliar em diversos problemas trabalhistas, como:
                        </p>

                        <ul className="list-disc pl-6 space-y-2">
                            <li>Rescisão de contrato e verbas rescisórias</li>
                            <li>Horas extras não pagas</li>
                            <li>Assédio moral no ambiente de trabalho</li>
                            <li>Doenças ocupacionais e acidentes de trabalho</li>
                            <li>Reconhecimento de vínculo empregatício</li>
                            <li>Problemas com FGTS e seguro-desemprego</li>
                            <li>Demissões indevidas e sem justa causa</li>
                        </ul>

                        <p>
                            Seja qual for sua situação, entrar em contato com um especialista é o primeiro passo para garantir seus direitos.
                        </p>
                    </div>

                    <Button
                        className="mt-8 bg-juris-accent hover:bg-opacity-80 text-white font-medium"
                        onClick={() => {
                            // Scroll to top to focus on the form
                            window.scrollTo({ top: 0, behavior: 'smooth' });

                            // Focus on the input after scrolling
                            setTimeout(() => {
                                const phoneInput = document.querySelector('input[name="phone"]');
                                if (phoneInput) {
                                    (phoneInput as HTMLInputElement).focus();
                                }
                            }, 800);
                        }}
                    >
                        Falar com um especialista agora
                    </Button>
                </motion.div>
            </main>

            <Footer />
        </div>
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
        <div className="bg-white bg-opacity-5 p-6 rounded-lg border border-white border-opacity-10 hover:border-juris-accent transition-colors">
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
