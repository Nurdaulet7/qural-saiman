/* =========================================================
   QURAL-SAIMAN — единый источник данных каталога
   Сгенерировано из catalog.xlsx (88 позиций).
   window.QS = { families, categories, tools, dgu, brands, powers, helpers }
   ========================================================= */
(function(){
  const families = [
    { id:'concrete', name:'Бетон и грунт' },
    { id:'cut',      name:'Резка и демонтаж' },
    { id:'finish',   name:'Шлифовка и отделка' },
    { id:'power',    name:'Энергия и сварка' },
    { id:'site',     name:'Высота, сад, уборка' },
  ];

  const categories = [
    { id:'towers', name:'Вышки-туры и леса', short:'Вышки-туры', family:'site', icon:'layers' },
    { id:'ladders', name:'Лестницы и стремянки', short:'Лестницы', family:'site', icon:'move-vertical' },
    { id:'gen-petrol', name:'Бензиновые генераторы', short:'Генераторы', family:'power', icon:'plug-zap' },
    { id:'concrete-work', name:'Бетонное оборудование', short:'Бетон', family:'concrete', icon:'cylinder' },
    { id:'rammers', name:'Вибротрамбовки', short:'Трамбовки', family:'concrete', icon:'arrow-down-to-line' },
    { id:'plates', name:'Виброплиты', short:'Виброплиты', family:'concrete', icon:'layers-2' },
    { id:'concrete-cut', name:'Резка бетона и асфальта', short:'Резка бетона', family:'cut', icon:'construction' },
    { id:'demolition', name:'Перфораторы и отбойники', short:'Перфораторы', family:'cut', icon:'hammer' },
    { id:'power-tools', name:'Электроинструменты', short:'Электро­инструмент', family:'finish', icon:'drill' },
    { id:'angle-grinders', name:'Углошлифовальные машины', short:'Болгарки', family:'finish', icon:'disc-3' },
    { id:'sanders', name:'Шлифовальные машины', short:'Шлифмашины', family:'finish', icon:'circle-dot' },
    { id:'saws', name:'Пилы торцовочные и циркулярные', short:'Пилы', family:'cut', icon:'scissors' },
    { id:'tile', name:'Плиткорезы', short:'Плиткорезы', family:'cut', icon:'grid-2x2' },
    { id:'compressors', name:'Компрессоры и пневмо', short:'Компрессоры', family:'power', icon:'wind' },
    { id:'painting', name:'Окрасочное оборудование', short:'Краскопульты', family:'finish', icon:'paintbrush' },
    { id:'lifting', name:'Грузоподъемное оборудование', short:'Тали и краны', family:'site', icon:'arrow-up-from-line' },
    { id:'welding', name:'Сварочное оборудование', short:'Сварка', family:'power', icon:'flame' },
    { id:'measuring', name:'Измерительное оборудование', short:'Замеры', family:'site', icon:'ruler' },
    { id:'cleaning', name:'Уборочное оборудование', short:'Пылесосы', family:'site', icon:'sparkles' },
    { id:'garden', name:'Газон и почва', short:'Газон и сад', family:'site', icon:'sprout' },
  ];

  // id, name, cat, brand, power, price, spec, photo, priceNote, badge, top
  const T = (id,name,cat,brand,power,price,spec,photo,priceNote,badge,top)=>
    ({id,name,cat,brand,power,price,spec,photo,priceNote:priceNote||'',badge:badge||'',top:!!top});

  const tools = [
    T('vyshka-tura-vs-250-0-7-0-8h1-5m','Вышка-тура ВС-250/0,7 (0,8х1,5м)','towers','','Ручной',2500,'1 чел., 1,5х0,85 м, до 120 кг','vyshka-tura-vs-250-0-7-0-8h1-5m.png','От 2 500 (1,2 м) до 4 500 (6,0 м)','',false),
    T('vyshka-tura-vs-250-1-2-1-2h2-m','Вышка-тура ВС-250/1,2 (1,2х2 м)','towers','','Ручной',2600,'2 чел., 1,5х1,2 м, до 250 кг, на колесах','vyshka-tura-vs-250-1-2-1-2h2-m.png','От 2 600 (1,2 м) до 5 000 (6,0 м)','',true),
    T('stroitelnye-ramnye-lesa','Строительные рамные леса','towers','','Ручной',350,'Высота - 2 м, Ширина - 1 м, Длина - 3 м','stroitelnye-ramnye-lesa.png','Комплект - 350, Трап - 350','',false),
    T('krause-corda-3-6','KRAUSE CORDA 3×6','ladders','KRAUSE','Ручной',2500,'Высота до 4,57 м','krause-corda-3x6.png','','',false),
    T('krause-corda-3-9','KRAUSE CORDA 3×9','ladders','KRAUSE','Ручной',2700,'Высота до 6,19 м','krause-corda-3x9.png','','',false),
    T('krause-corda-3-12','KRAUSE CORDA 3×12','ladders','KRAUSE','Ручной',3000,'Высота до 9,00 м','krause-corda-3x12.png','','',false),
    T('krause-corda-3-14','KRAUSE CORDA 3×14','ladders','KRAUSE','Ручной',3300,'Высота до 10,80 м','krause-corda-3x14.png','','',false),
    T('transformer-krause-corda-5-4-4-5','Трансформер KRAUSE CORDA 5 4×4×5','ladders','KRAUSE','Ручной',2500,'Рабочая высота до 6,15 м, Высота стремянки до 3,8 м','transformer-krause-corda-5-4x4x5.png','','',false),
    T('alteco-apg-3700','ALTECO APG 3700','gen-petrol','ALTECO','Бензиновый',4000,'Номинальная мощность 2,5 кВт, бензиновый двигатель','alteco-apg-3700.png','','',false),
    T('hyundai-hhy-9050fe','HYUNDAI HHY-9050FE','gen-petrol','HYUNDAI','Бензиновый',7500,'Номинальная мощность 6 кВт, напряжение 220 В','hyundai-hhy-9050fe.png','','',false),
    T('alteco-apg-9800-te','ALTECO APG 9800 TE','gen-petrol','ALTECO','Бензиновый',8000,'Мощность 7 кВт (макс. 7,5 кВт), напряжение 220/380 В','alteco-apg-9800-te.png','','',true),
    T('magnetta-gfe9000','MAGNETTA GFE9000','gen-petrol','MAGNETTA','Бензиновый',8000,'Номинальная мощность 7 кВт, напряжение 220 В','magnetta-gfe9000.png','','',false),
    T('betonosmesitel-kedr-130-l','Бетоносмеситель KEDR 130 л','concrete-work','KEDR','Электрический',3500,'Объем барабана - 130 л','betonosmesitel-kedr-130-l.png','','',true),
    T('betonosmesitel-kedr-180-l','Бетоносмеситель KEDR 180 л','concrete-work','KEDR','Электрический',4500,'Объем барабана - 180 л','betonosmesitel-kedr-180-l.png','','',false),
    T('vibroreyka-tor-xh250','Виброрейка TOR XH250','concrete-work','TOR','Электрический',7000,'Длина лезвия - 2 м, Мощность 0,5 кВт','vibroreyka-tor-xh250.png','','',false),
    T('drel-mikser-patriot-dm-100','Дрель-миксер PATRIOT DM 100','concrete-work','PATRIOT','Электрический',1500,'Мощность 1400 Вт','drel-mikser-patriot-dm-100.png','','',false),
    T('kedr-hcd110-sb-elektricheskaya','KEDR HCD110 (SB) Электрическая','rammers','KEDR','Электрический',8000,'Для помещений без выхлопных газов','kedr-hcd110-sb-elektricheskaya.png','','',false),
    T('alteco-rm80l-benzinovaya','ALTECO RM80L Бензиновая','rammers','ALTECO','Бензиновый',12000,'Для уплотнения грунта, песка, щебня','alteco-rm80l-benzinovaya.png','','',false),
    T('wacker-neuson-ds-70-dizelnaya','Wacker Neuson DS 70 Дизельная','rammers','Wacker Neuson','Дизельный',15000,'Для профессионального уплотнения','wacker-neuson-ds-70-dizelnaya.png','','',false),
    T('alteco-e60-tf-benzinovaya','ALTECO E60 TF Бензиновая','plates','ALTECO','Бензиновый',6500,'Подходит для небольших площадок и дорожек','alteco-e60-tf-benzinovaya.png','','',false),
    T('plcm-50375-benzinovaya','PLCM-50375 Бензиновая','plates','','Бензиновый',6500,'Для уплотнения грунта, песка, щебня','plcm-50375-benzinovaya.png','','',false),
    T('alteco-c80-tl-benzinovaya','ALTECO C80 TL Бензиновая','plates','ALTECO','Бензиновый',7500,'Для уплотнения грунта, песка, щебня, гравия, асфальта','alteco-c80-tl-benzinovaya.png','','',false),
    T('alteco-c100tl-benzinovaya','ALTECO C100TL Бензиновая','plates','ALTECO','Бензиновый',8500,'Усиленная виброплита для плотного грунта, щебня, асфальта','alteco-c100tl-benzinovaya.png','','hit',true),
    T('shtroborez-zubr-zsh-p65-2600-pvstk','Штроборез ЗУБР ЗШ-П65-2600 ПВСТК','concrete-cut','ЗУБР','Электрический',3000,'Для нарезки канавок в стенах','shtroborez-zubr-zsh-p65-2600-pvstk.png','','',false),
    T('benzorez-stihl-ts-420','Бензорез STIHL TS 420','concrete-cut','STIHL','Электрический',10000,'Диск 350 мм, Глубина реза до 125 мм, 4,4 Л.С.','benzorez-stihl-ts-420.png','','',false),
    T('elektrorez-husqvarna-k4000','Электрорез Husqvarna K4000','concrete-cut','Husqvarna','Электрический',12000,'Диск 350 мм, Влажная резка (без пыли)','elektrorez-husqvarna-k4000.png','','',false),
    T('benzorez-husqvarna-k770','Бензорез Husqvarna K770','concrete-cut','Husqvarna','Электрический',13000,'Диск 350 мм, Точная резка вплотную к стене','benzorez-husqvarna-k770.png','','',true),
    T('shvonarezchik-alteco-q300l','Швонарезчик ALTECO Q300L','concrete-cut','ALTECO','Электрический',8000,'Диск до 300 мм, Пропил до 90 мм','shvonarezchik-alteco-q300l.png','','',false),
    T('shvonarezchik-splitstoun-cs-146-lifan','Швонарезчик Сплитстоун CS-146 Lifan','concrete-cut','Сплитстоун','Электрический',10000,'Для резки швов в асфальте и бетоне','shvonarezchik-splitstoun-cs-146-lifan.png','','hit',true),
    T('rezchik-shvov-alteco-q450-l','Резчик швов ALTECO Q450 L','concrete-cut','ALTECO','Электрический',15000,'Диск до 450 мм, Пропил до 150 мм','rezchik-shvov-alteco-q450-l.png','','',false),
    T('perforator-lvt-rhm-800-1-bmc','Перфоратор LVT RHM-800/1 BMC','demolition','LVT','Электрический',2000,'800 Вт, 2,5 Дж, Сверление до 24 мм','perforator-lvt-rhm-800-1-bmc.png','','',false),
    T('perforator-lvt-rhm-1500-plus','Перфоратор LVT RHM 1500 PLUS','demolition','LVT','Электрический',2500,'1500 Вт, 6,5 Дж, Сверление до 32 мм','perforator-lvt-rhm-1500-plus.png','','',false),
    T('perforator-dewalt-d25614k-sds-max','Перфоратор DeWALT D25614K SDS-Max','demolition','DeWALT','Электрический',4000,'1350 Вт, 10,5 Дж','perforator-dewalt-d25614k-sds-max.png','','',true),
    T('otboynyy-molotok-dbrk-1300','Отбойный молоток DBRK-1300','demolition','','Электрический',4200,'1300 Вт, 46 Дж, 1400 уд/мин','otboynyy-molotok-dbrk-1300.png','','hit',true),
    T('fen-promyshlennyy-hg-2000wr','Фен Промышленный HG-2000WR','power-tools','','Электрический',1500,'Для удаления краски, сушки, формовки пластика','fen-promyshlennyy-hg-2000wr.png','','',false),
    T('elektrolobzik-bosch-pst-750-pe','Электролобзик Bosch PST 750 PE','power-tools','Bosch','Электрический',1500,'Для прямого и фигурного распила','elektrolobzik-bosch-pst-750-pe.png','','',false),
    T('shurupovert-akkumulyatornyy-csd-li-18g','Шуруповерт Аккумуляторный CSD Li-18G','power-tools','CSD','Аккумуляторный',1500,'Для закручивания крепежа и сверления','shurupovert-akkumulyatornyy-csd-li-18g.png','','',false),
    T('cepnaya-elektropila-ecs-1700','Цепная электропила ECS-1700','power-tools','','Электрический',3500,'Для распила древесины, обрезки веток','cepnaya-elektropila-ecs-1700.png','','',false),
    T('pistolet-fubag-f50-gvozdezabivnoy','Пистолет Fubag F50 гвоздезабивной','power-tools','Fubag','Пневматический',1500,'Работает от компрессора','pistolet-fubag-f50-gvozdezabivnoy.png','','',false),
    T('ivt-ag-125g','IVT AG-125G','angle-grinders','IVT','Электрический',1500,'Диск 125 мм','ivt-ag-125g.png','','',false),
    T('bosch-gws-14-125-s','Bosch GWS 14-125 S','angle-grinders','Bosch','Электрический',2000,'Диск 125 мм','bosch-gws-14-125-s.png','','',false),
    T('crown-ct13044','CROWN CT13044','angle-grinders','CROWN','Электрический',2000,'Диск 180 мм','crown-ct13044.png','','',false),
    T('crown-ct13489-230','CROWN CT13489-230','angle-grinders','CROWN','Электрический',2500,'Диск 230 мм','crown-ct13489-230.png','','',false),
    T('bosch-gws-24-230-jz','Bosch GWS 24-230 JZ','angle-grinders','Bosch','Электрический',3200,'Диск 230 мм','bosch-gws-24-230-jz.png','','hit',true),
    T('vibroshlifovalnaya-mashina-os-300g','Виброшлифовальная машина OS-300G','sanders','','Электрический',1000,'Для финишной обработки и выравнивания','vibroshlifovalnaya-mashina-os-300g.png','','',false),
    T('ekscentrikovaya-shlifmashina-rs-150-gm','Эксцентриковая шлифмашина RS-150 GM','sanders','','Электрический',1500,'Для тонкой шлифовки и полировки','ekscentrikovaya-shlifmashina-rs-150-gm.png','','',false),
    T('shlifmashina-dlya-sten-i-potolkov-ds-900-v-h','Шлифмашина для стен и потолков DS-900 V-H','sanders','','Электрический',5000,'Для шлифовки стен, потолков, шпатлевки','shlifmashina-dlya-sten-i-potolkov-ds-900-v-h.png','','',true),
    T('pchelka-ss-185-2-rc','Пчелка СS-185/2-RC','saws','Пчелка','Электрический',2500,'Диск 185 мм, Пропил до 63 мм, 1050 Вт','pchelka-ss-185-2-rc.png','','',false),
    T('bosch-gcm-216','Bosch GCM 216','saws','Bosch','Электрический',3200,'Диск 216 мм, Лазер 1300 Вт','bosch-gcm-216.png','','',false),
    T('alteco-ms-2200-255-bd','ALTECO MS 2200-255 BD','saws','ALTECO','Электрический',4500,'Диск 255 мм, Лазер, Протяжка 2000 Вт','alteco-ms-2200-255-bd.png','','',false),
    T('mts-255-rc','MTS-255-RC','saws','MTS','Электрический',4500,'Диск 255 мм, Распил до 120 мм, 1900 Вт','mts-255-rc.png','','',false),
    T('bosch-gco-14-24j','Bosch GCO 14-24J','saws','Bosch','Электрический',3500,'Диск 355 мм, Глубина реза до 100 мм, 2400 Вт','bosch-gco-14-24j.png','','',false),
    T('plitkorez-ruchnoy-do-1000-mm','Плиткорез ручной (до 1000 мм)','tile','','Ручной',4000,'Длина реза до 1000 мм','plitkorez-ruchnoy-do-1000-mm.png','','',false),
    T('plitkorez-ruchnoy-do-1200-mm','Плиткорез ручной (до 1200 мм)','tile','','Ручной',4500,'Длина реза до 1200 мм','plitkorez-ruchnoy-do-1200-mm.png','','',false),
    T('plitkorez-ruchnoy-do-1600-mm','Плиткорез ручной (до 1600 мм)','tile','','Ручной',6000,'Длина реза до 1600 мм','plitkorez-ruchnoy-do-1600-mm.png','','',false),
    T('plitkorez-ruchnoy-do-1800-mm','Плиткорез ручной (до 1800 мм)','tile','','Ручной',6500,'Длина реза до 1800 мм','plitkorez-ruchnoy-do-1800-mm.png','','',false),
    T('einhell-te-tc-620-u','Einhell TE-TC 620 U','tile','Einhell','Электрический',8000,'620 мм, 900 Вт, диск 200 мм, водяное охлаждение','einhell-te-tc-620-u.png','','',false),
    T('einhell-rt-sc-920-l','Einhell RT-SC 920 L','tile','Einhell','Электрический',10000,'900 мм, лазер, водяное охлаждение, рез до 45°','einhell-rt-sc-920-l.png','','',false),
    T('kompressor-vozdushnyy-as-24-r-25-l','Компрессор воздушный АС-24 R (25 л)','compressors','','Электрический',3200,'24 л, 248 л/мин, 8 бар','kompressor-vozdushnyy-as-24-r-25-l.png','','',false),
    T('kompressor-vozdushnyy-as-50pb-50-l','Компрессор воздушный АС-50PB (50 л)','compressors','','Электрический',4500,'50 л, 206 л/мин, 8 бар','kompressor-vozdushnyy-as-50pb-50-l.png','','',false),
    T('kompressor-porshnevoy-remeza-100-l','Компрессор поршневой Remeza (100 л)','compressors','Remeza','Электрический',10000,'100 л, 420 л/мин, 10 бар','kompressor-porshnevoy-remeza-100-l.png','','hit',true),
    T('pnevmaticheskiy-kraskoraspylitel','Пневматический краскораспылитель','compressors','','Пневматический',1000,'Работает от компрессора','pnevmaticheskiy-kraskoraspylitel.png','','',false),
    T('kraskopult-bezvozdushnyy-profset-935','Краскопульт безвоздушный PROFSET-935','painting','PROFSET','Электрический',12000,'Для средних объемов работ','kraskopult-bezvozdushnyy-profset-935.png','','',false),
    T('kraskopult-bezvozdushnyy-profset-1095','Краскопульт безвоздушный PROFSET-1095','painting','PROFSET','Электрический',15000,'Для больших объемов работ','kraskopult-bezvozdushnyy-profset-1095.png','','',false),
    T('kraskopult-bezvozdushnyy-profset-stb-970','Краскопульт безвоздушный PROFSET STB-970','painting','PROFSET','Электрический',20000,'Для больших объемов, высокая скорость','kraskopult-bezvozdushnyy-profset-stb-970.png','','hit',true),
    T('tal-cepnaya-sparta','Таль цепная Sparta','lifting','Sparta','Ручной',1500,'Грузоподъемность 1 т','tal-cepnaya-sparta.png','','',false),
    T('stoyka-gidravlicheskaya-matrix','Стойка Гидравлическая Matrix','lifting','Matrix','Ручной',3500,'Грузоподъемность 0,5 т','stoyka-gidravlicheskaya-matrix.png','','',false),
    T('rohlya-gidravlicheskaya','Рохля Гидравлическая','lifting','','Ручной',4000,'Грузоподъемность 3 т','rohlya-gidravlicheskaya.png','','',false),
    T('kran-gidravlicheskiy-e1203a','Кран Гидравлический E1203A','lifting','','Ручной',8000,'Грузоподъемность 3 т','kran-gidravlicheskiy-e1203a.png','','',false),
    T('magnetta-mma-160hs-igbt','Magnetta MMA-160HS IGBT','welding','MAGNETTA','Электрический',3000,'Сварочный ток: 140-160 А','magnetta-mma-160hs-igbt.png','','',true),
    T('elektrody-monolith-uoni-13-55','Электроды Monolith УОНИ-13/55','welding','Monolith','Ручной',5000,'Диаметр: 4 мм','elektrody-monolith-uoni-13-55.png','5 000 / пачка','',false),
    T('dalnomer-lazernyy-resanta-dl-60','Дальномер лазерный Ресанта ДЛ-60','measuring','Ресанта','Аккумуляторный',1000,'Для измерения расстояний, площади и объема','dalnomer-lazernyy-resanta-dl-60.png','','',false),
    T('lazernyy-nivelir-bosch-universal-360','Лазерный нивелир Bosch Universal 360','measuring','Bosch','Аккумуляторный',3000,'Для точной разметки и выравнивания','lazernyy-nivelir-bosch-universal-360.png','','',true),
    T('teplovizor-zubr-ikt-60','Тепловизор ЗУБР ИКТ-60','measuring','ЗУБР','Аккумуляторный',4000,'Для обнаружения утечек тепла','teplovizor-zubr-ikt-60.png','','',false),
    T('detektor-sensornyy-bosch-detect','Детектор сенсорный Bosch Detect','measuring','Bosch','Аккумуляторный',2000,'Для поиска скрытой проводки','detektor-sensornyy-bosch-detect.png','','',false),
    T('stroitelnyy-pylesos-bosch','Строительный пылесос Bosch','cleaning','Bosch','Электрический',4200,'Бак 20 л, встроенная розетка','stroitelnyy-pylesos-bosch.png','','',true),
    T('stroitelnyy-pylesos-jianba','Строительный пылесос Jianba','cleaning','Jianba','Электрический',3000,'Бак 30 л, эффективный сбор мелкой пыли','stroitelnyy-pylesos-jianba.png','','',false),
    T('podmetalno-snegouborochnaya-mashina','Подметально-снегоуборочная машина','cleaning','','Ручной',8000,'Бензиновая, ширина очистки 600 мм','podmetalno-snegouborochnaya-mashina.png','','',false),
    T('trimmer-elektricheskiy-bosch-afs-23-37','Триммер электрический Bosch AFS 23-37','garden','Bosch','Электрический',3000,'Для скашивания жестких сорняков, кустарников','trimmer-elektricheskiy-bosch-afs-23-37.png','','',false),
    T('gazonokosilka-elektricheskaya-bosch-rotak-32','Газонокосилка электрическая Bosch Rotak 32','garden','Bosch','Электрический',3800,'Для участков до 350 м² от сети','gazonokosilka-elektricheskaya-bosch-rotak-32.png','','',false),
    T('gazonokosilka-benzinovaya-ivt-glms-18b','Газонокосилка бензиновая IVT GLMS-18B','garden','IVT','Бензиновый',5000,'Для автономного кошения','gazonokosilka-benzinovaya-ivt-glms-18b.png','','',false),
    T('vozduhoduvka','Воздуходувка','garden','','Электрический',1500,'Для уборки листьев и мелкого мусора','vozduhoduvka.png','','',false),
    T('motokultivator-alteco-mk-7000','Мотокультиватор ALTECO MK 7000','garden','ALTECO','Бензиновый',8000,'Для вспашки и рыхления почвы','motokultivator-alteco-mk-7000.png','','',true)
  ];

  tools.find(t=>t.id==='vyshka-tura-vs-250-0-7-0-8h1-5m').calc={type:'height',startH:1.2,endH:6.0,step:1.2,priceStep:500};
  tools.find(t=>t.id==='vyshka-tura-vs-250-1-2-1-2h2-m').calc={type:'height',startH:1.2,endH:6.0,step:1.2,priceStep:600};
  tools.find(t=>t.id==='stroitelnye-ramnye-lesa').calc={type:'scaffold',sectionPrice:350,trapPrice:350};

  const dgu = [
    { id:'dgu-magnetta-d100e3', name:'Дизельный генератор Magnetta D100E3', power:'80 кВт', brand:'MAGNETTA', price:80000, note:'Мощность 80 кВт, дизельный двигатель', photo:'magnetta-d100e3.png' },
    { id:'dgu-huaguang-stc-50', name:'Дизельный генератор HUAGUANG STC-50', power:'50 кВт', brand:'HUAGUANG', price:60000, note:'Номинальная мощность 50 кВт, дизельный двигатель', photo:'huaguang-stc-50.png' },
    { id:'dgu-sitan-fu-nf-120', name:'Дизельный генератор SITAN FU NF-120', power:'120 кВт', brand:'SITAN FU', price:120000, note:'Номинальная мощность 120 кВт', photo:'sitan-fu-nf-120.png' },
    { id:'dgu-kofo-gf3-200', name:'Дизельный генератор KOFO GF3-200', power:'240 кВт', brand:'KOFO', price:170000, note:'Номинальная мощность 240 кВт, АВР', photo:'kofo-gf3-200.png' },
    { id:'dgu-thor-cummins-tec3-200', name:'Дизельный генератор THOR Cummins TEC3-200', power:'200 кВт', brand:'THOR Cummins', price:220000, note:'Номинальная мощность 200 кВт', photo:'thor-cummins-tec3-200.png' },
  ];

  const NO_PHOTO = 'assets/tools/_no-photo.svg';

  const HAVE = {
    'gazonokosilka-benzinovaya-ivt-glms-18b.png':1,
    'alteco-apg-3700.png':1,
    'alteco-apg-9800-te.png':1,
    'alteco-c100tl-benzinovaya.png':1,
    'alteco-c80-tl-benzinovaya.png':1,
    'alteco-e60-tf-benzinovaya.png':1,
    'alteco-ms-2200-255-bd.png':1,
    'alteco-rm80l-benzinovaya.png':1,
    'benzorez-husqvarna-k770.png':1,
    'benzorez-stihl-ts-420.png':1,
    'betonosmesitel-kedr-130-l.png':1,
    'betonosmesitel-kedr-180-l.png':1,
    'bosch-gcm-216.png':1,
    'bosch-gco-14-24j.png':1,
    'bosch-gws-14-125-s.png':1,
    'bosch-gws-24-230-jz.png':1,
    'cepnaya-elektropila-ecs-1700.png':1,
    'crown-ct13044.png':1,
    'crown-ct13489-230.png':1,
    'dalnomer-lazernyy-resanta-dl-60.png':1,
    'detektor-sensornyy-bosch-detect.png':1,
    'drel-mikser-patriot-dm-100.png':1,
    'einhell-rt-sc-920-l.png':1,
    'einhell-te-tc-620-u.png':1,
    'ekscentrikovaya-shlifmashina-rs-150-gm.png':1,
    'elektrody-monolith-uoni-13-55.png':1,
    'elektrolobzik-bosch-pst-750-pe.png':1,
    'elektrorez-husqvarna-k4000.png':1,
    'fen-promyshlennyy-hg-2000wr.png':1,
    'gazonokosilka-elektricheskaya-bosch-rotak-32.png':1,
    'gws24.png':1,
    'huaguang-stc-50.png':1,
    'hyundai-hhy-9050fe.png':1,
    'ivt-ag-125g.png':1,
    'kedr-hcd110-sb-elektricheskaya.png':1,
    'kofo-gf3-200.png':1,
    'kompressor-porshnevoy-remeza-100-l.png':1,
    'kompressor-vozdushnyy-as-24-r-25-l.png':1,
    'kompressor-vozdushnyy-as-50pb-50-l.png':1,
    'kran-gidravlicheskiy-e1203a.png':1,
    'kraskopult-bezvozdushnyy-profset-1095.png':1,
    'kraskopult-bezvozdushnyy-profset-935.png':1,
    'kraskopult-bezvozdushnyy-profset-stb-970.png':1,
    'krause-corda-3x12.png':1,
    'krause-corda-3x14.png':1,
    'krause-corda-3x6.png':1,
    'krause-corda-3x9.png':1,
    'lazernyy-nivelir-bosch-universal-360.png':1,
    'magnetta-d100e3.png':1,
    'magnetta-gfe9000.png':1,
    'magnetta-mma-160hs-igbt.png':1,
    'motokultivator-alteco-mk-7000.png':1,
    'mts-255-rc.png':1,
    'mts255.png':1,
    'otboynyy-molotok-dbrk-1300.png':1,
    'pchelka-ss-185-2-rc.png':1,
    'perforator-dewalt-d25614k-sds-max.png':1,
    'perforator-lvt-rhm-1500-plus.png':1,
    'perforator-lvt-rhm-800-1-bmc.png':1,
    'pistolet-fubag-f50-gvozdezabivnoy.png':1,
    'plaster-profset.png':1,
    'plate-c100.png':1,
    'plcm-50375-benzinovaya.png':1,
    'plitkorez-ruchnoy-do-1000-mm.png':1,
    'plitkorez-ruchnoy-do-1200-mm.png':1,
    'plitkorez-ruchnoy-do-1600-mm.png':1,
    'plitkorez-ruchnoy-do-1800-mm.png':1,
    'pnevmaticheskiy-kraskoraspylitel.png':1,
    'podmetalno-snegouborochnaya-mashina.png':1,
    'rezchik-shvov-alteco-q450-l.png':1,
    'rohlya-gidravlicheskaya.png':1,
    'shlifmashina-dlya-sten-i-potolkov-ds-900-v-h.png':1,
    'shtroborez-zubr-zsh-p65-2600-pvstk.png':1,
    'shurupovert-akkumulyatornyy-csd-li-18g.png':1,
    'shvonarezchik-alteco-q300l.png':1,
    'shvonarezchik-splitstoun-cs-146-lifan.png':1,
    'sitan-fu-nf-120.png':1,
    'stoyka-gidravlicheskaya-matrix.png':1,
    'stroitelnye-ramnye-lesa.png':1,
    'stroitelnyy-pylesos-bosch.png':1,
    'stroitelnyy-pylesos-jianba.png':1,
    'tal-cepnaya-sparta.png':1,
    'teplovizor-zubr-ikt-60.png':1,
    'thor-cummins-tec3-200.png':1,
    'transformer-krause-corda-5-4x4x5.png':1,
    'trimmer-elektricheskiy-bosch-afs-23-37.png':1,
    'vibroreyka-tor-xh250.png':1,
    'vibroshlifovalnaya-mashina-os-300g.png':1,
    'vozduhoduvka.png':1,
    'vyshka-tura-vs-250-0-7-0-8h1-5m.png':1,
    'vyshka-tura-vs-250-1-2-1-2h2-m.png':1,
    'wacker-neuson-ds-70-dizelnaya.png':1
  };

  /* Собирает window.QS из набора данных. Один и тот же расчёт
     для встроенного каталога и для данных из базы. */
  function build(src){
    const families = src.families, categories = src.categories,
          tools = src.tools, dgu = src.dgu;

    const byId = {}; tools.concat(dgu).forEach(t=>{ byId[t.id]=t });
    const catName = id => (categories.find(c=>c.id===id)||{}).name || '';
    const catById = id => categories.find(c=>c.id===id);

    // photo у позиции: имя файла (встроенный каталог) или полный URL (база)
    const photoFile = id => (byId[id]||{}).photo || '';
    const isUrl = p => /^https?:\/\//.test(p);
    const hasPhoto = id => { const p = photoFile(id); return isUrl(p) ? true : !!HAVE[p] };
    const photo = id => {
      const p = photoFile(id);
      if(!p) return NO_PHOTO;
      return isUrl(p) ? p : (HAVE[p] ? 'assets/tools/'+p : NO_PHOTO);
    };

    const brandCount = {};
    tools.forEach(t=>{ if(t.brand){ brandCount[t.brand]=(brandCount[t.brand]||0)+1 } });
    const brands = Object.keys(brandCount).sort((a,b)=>a.localeCompare(b,'ru'));

    const powerOrder = ['Бензиновый','Электрический','Аккумуляторный','Дизельный','Пневматический','Ручной'];
    const powerCount = {};
    tools.forEach(t=>{ powerCount[t.power]=(powerCount[t.power]||0)+1 });
    const powers = powerOrder.filter(p=>powerCount[p]);

    const catCount = {};
    tools.forEach(t=>{ catCount[t.cat]=(catCount[t.cat]||0)+1 });

    const isPromoPower = p => /бензин|электр|аккум/i.test(p||'');

    return {
      families, categories, tools, dgu, brands, powers,
      brandCount, powerCount, catCount,
      promo: src.promo || null, settings: src.settings || null,
      source: src.source || 'built-in', version: src.version || '',
      catName, catById, img: ()=>NO_PHOTO, photo, hasPhoto, photoFile, isPromoPower,
      fmt: n => (n==null ? 'Цена по запросу' : Number(n).toLocaleString('ru-RU').replace(/,/g,' ') + ' ₸'),
      build: build
    };
  }

  window.QS = build({ families, categories, tools, dgu });
})();
