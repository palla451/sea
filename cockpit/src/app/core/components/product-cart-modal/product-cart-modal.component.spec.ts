import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProductCartModalComponent } from "./product-cart-modal.component";

describe("ProductCartModalComponent", () => {
  let component: ProductCartModalComponent;
  let fixture: ComponentFixture<ProductCartModalComponent>;

  const mockProduct = {
    id: "1",
    name: "Wazuh",
    image: "Wazuh.svg",
    description:
      "Wazuh was selected for the SIEM module because it offers a comprehensive and scalable open-source solution for security event collection, correlation, and analysis. Built on a customized version of Amazon OpenSearch, it provides powerful capabilities for real-time threat detection while ensuring flexibility and adaptability to complex environments like naval systems. Its integration-friendly architecture and native support for features such as File Integrity Monitoring (FIM) and custom decoder development make it well-suited for handling diverse data sources, including EDR, IDS, and OT security components.The decision to separate functional layers within the cybersecurity architecture—including the separation between the Log Collector and the SIEM, despite their close technological relationship—was driven by key architectural and operational considerations. First and foremost, this separation promotes a clear decoupling of responsibilities: the Log Collector focuses solely on ingesting, parsing, and forwarding raw logs from onboard systems, while the SIEM is dedicated to correlation, analysis, and threat detection. By isolating these roles, each component can be optimized independently in terms of performance, scalability, and security. From a cybersecurity perspective, this modular approach enhances system resilience. In the event of a compromise or failure in one module, the other can continue functioning with minimal disruption. It also simplifies maintenance and troubleshooting, allowing updates or reconfigurations to be applied to one component without impacting the other. Furthermore, separating the Log Collector from the SIEM supports better resource allocation and tuning. Log parsing and ingestion are often resource-intensive and require different processing logic than the correlation and alerting tasks performed by the SIEM. Keeping them distinct ensures that neither process starves the other of critical resources. Finally, this architectural choice allows for greater flexibility and future scalability. As system complexity grows or integration needs evolve (e.g., with additional onboard subsystems or external analysis platforms), having distinct, well-defined layers allows for easier adaptation and extension of the overall cybersecurity solution.",
    link: "https://wazuh.com/",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCartModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCartModalComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    component.imagesPath = "/assets/images/";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
