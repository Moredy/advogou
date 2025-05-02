
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from 'framer-motion';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  phone: z.string().min(10, {
    message: "Insira um número de telefone válido com DDD.",
  }),
  message: z.string().min(10, {
    message: "A mensagem deve ter pelo menos 10 caracteres.",
  }),
});

const Contact: React.FC = () => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Mensagem enviada",
      description: "Entraremos em contato em breve.",
    });
    form.reset();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-juris-dark to-black">
      <Header />
      
      <main className="flex-grow container-custom py-8 md:py-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-semibold mb-4 text-white">
            Entre em contato
          </h1>
          <p className="text-lg max-w-2xl mx-auto text-juris-text text-opacity-90">
            Tem dúvidas ou precisa de mais informações? Nossa equipe está pronta para ajudar você.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div 
              className="absolute inset-0 bg-juris-accent rounded-full filter blur-[100px] opacity-20"
              aria-hidden="true"
            />
            <div className="card-custom h-full">
              <h2 className="text-2xl font-medium mb-6 text-white">Informações de contato</h2>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-5 rounded-full flex items-center justify-center mr-4">
                    <Phone className="text-juris-accent" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Telefone</p>
                    <p className="text-juris-text text-opacity-80">(11) 99999-9999</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-5 rounded-full flex items-center justify-center mr-4">
                    <Mail className="text-juris-accent" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-juris-text text-opacity-80">contato@jurisquick.com.br</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-5 rounded-full flex items-center justify-center mr-4">
                    <MessageCircle className="text-juris-accent" />
                  </div>
                  <div>
                    <p className="text-white font-medium">WhatsApp</p>
                    <p className="text-juris-text text-opacity-80">(11) 99999-9999</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div 
              className="absolute inset-0 bg-juris-accent rounded-full filter blur-[100px] opacity-20"
              aria-hidden="true"
            />
            <div className="card-custom">
              <h2 className="text-2xl font-medium mb-6 text-white">Envie uma mensagem</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-juris-text">Nome</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Seu nome completo" 
                            {...field} 
                            className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-juris-text">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="seu@email.com" 
                              {...field} 
                              className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-juris-text">Telefone</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(11) 99999-9999" 
                              {...field} 
                              className="bg-white bg-opacity-5 border-white border-opacity-10 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-juris-text">Mensagem</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Como podemos ajudar?" 
                            {...field} 
                            className="bg-white bg-opacity-5 border-white border-opacity-10 text-white min-h-[120px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full btn-primary"
                  >
                    Enviar mensagem
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
