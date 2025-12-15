import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";
import { CodeBlock, InlineCode } from "./ui/code-block";

export function WhyPanoptesAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-500 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <span className="lang-en">Security & Compliance</span>
            <span className="lang-es">Seguridad y Cumplimiento</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-slate-600 dark:text-slate-400 pt-2">
          <p className="lang-en">Meet regulatory requirements by maintaining complete audit logs of who changed what data, when, and from where. Perfect for industries that need to demonstrate compliance with data protection regulations like GDPR, HIPAA, and SOC 2.</p>
          <p className="lang-es">Cumple con los requisitos regulatorios manteniendo registros de auditoría completos de quién cambió qué datos, cuándo y desde dónde. Perfecto para industrias que necesitan demostrar cumplimiento con regulaciones de protección de datos como GDPR, HIPAA y SOC 2.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-500 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span className="lang-en">Forensics & Debugging</span>
            <span className="lang-es">Forense y Depuración</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-slate-600 dark:text-slate-400 pt-2">
          <p className="lang-en">When something goes wrong, Panoptes gives you the complete story. See exactly what data changed, who made the change, and the full context around the operation. Debug production issues faster with complete audit trails.</p>
          <p className="lang-es">Cuando algo sale mal, Panoptes te da la historia completa. Ve exactamente qué datos cambiaron, quién hizo el cambio y el contexto completo alrededor de la operación. Depura problemas de producción más rápido con rastros de auditoría completos.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-indigo-500 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span className="lang-en">Data Recovery</span>
            <span className="lang-es">Recuperación de Datos</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-slate-600 dark:text-slate-400 pt-2">
          <p className="lang-en">With before/after snapshots, you can reconstruct historical states of your data or implement point-in-time recovery strategies. Accidentally deleted critical data? Restore it from the audit logs.</p>
          <p className="lang-es">Con instantáneas antes/después, puedes reconstruir estados históricos de tus datos o implementar estrategias de recuperación point-in-time. ¿Eliminaste accidentalmente datos críticos? Restáuralos desde los logs de auditoría.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function KeyFeaturesAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="before-after">
        <AccordionTrigger className="text-lg font-semibold">
          <span className="lang-en">Automatic Before/After Capture</span>
          <span className="lang-es">Captura Automática Antes/Después</span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <p className="text-slate-600 dark:text-slate-400">
            <span className="lang-en">For UPDATE and DELETE operations, Panoptes automatically fetches the current state before executing the query, then captures the new state after. This gives you a complete diff of what changed.</span>
            <span className="lang-es">Para operaciones UPDATE y DELETE, Panoptes obtiene automáticamente el estado actual antes de ejecutar la consulta, luego captura el nuevo estado después. Esto te da un diff completo de lo que cambió.</span>
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">UPDATE</Badge>
            <Badge variant="outline">DELETE</Badge>
            <Badge variant="outline">INSERT</Badge>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="context">
        <AccordionTrigger className="text-lg font-semibold">
          <span className="lang-en">Flexible Context Management</span>
          <span className="lang-es">Gestión de Contexto Flexible</span>
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            <span className="lang-en">Add any context you need to your audit events. Perfect for Express.js, Next.js, NestJS, and other frameworks:</span>
            <span className="lang-es">Agrega cualquier contexto que necesites a tus eventos de auditoría. Perfecto para Express.js, Next.js, NestJS y otros frameworks:</span>
          </p>
          <CodeBlock
            language="javascript"
            code={`// Example with Express.js middleware
app.use((req, res, next) => {
  setUserContext({
    actorType: req.user ? 'USER' : 'SYSTEM',
    actorId: req.user?.id || 'anonymous',
    actorName: req.user?.name,
    actorEmail: req.user?.email,
    actorIp: req.ip,
    actorRoles: req.user?.roles,
    requestId: req.id,
    sessionId: req.session?.id,
    metadata: {
      userAgent: req.get('user-agent'),
      endpoint: req.path,
      method: req.method
    }
  });
  next();
});`}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="transports">
        <AccordionTrigger className="text-lg font-semibold">
          <span className="lang-en">Multiple Transport Options</span>
          <span className="lang-es">Múltiples Opciones de Transporte</span>
        </AccordionTrigger>
        <AccordionContent className="space-y-3">
          <p className="text-slate-600 dark:text-slate-400">
            <span className="lang-en">Send your audit events to multiple destinations simultaneously:</span>
            <span className="lang-es">Envía tus eventos de auditoría a múltiples destinos simultáneamente:</span>
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/50">
              <Badge>Console</Badge>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                <span className="lang-en">Development & debugging</span>
                <span className="lang-es">Desarrollo y depuración</span>
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/50">
              <Badge>File</Badge>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                <span className="lang-en">Log aggregation</span>
                <span className="lang-es">Agregación de logs</span>
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/50">
              <Badge>HTTP</Badge>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                <span className="lang-en">Webhooks & SIEM</span>
                <span className="lang-es">Webhooks y SIEM</span>
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-200/60 dark:border-slate-700/50">
              <Badge>Database</Badge>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                <span className="lang-en">Queryable storage</span>
                <span className="lang-es">Almacenamiento consultable</span>
              </span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
